import { ArgMindedBlock, HDKey, MinedBlock, PrivateKey } from "@ellcrys/spell";
import BigNumber from "bignumber.js";
import Bluebird from "bluebird";
import { createPublicKey } from "crypto";
import Decimal from "decimal.js";
import { app, ipcMain, Menu } from "electron";
import log from "electron-log";
import fs from "fs";
import * as HashrateParser from "js-hashrate-parser";
import * as _ from "lodash";
import * as mkdirp from "mkdirp";
import Datastore from "nedb";
import path from "path";
import * as Interval from "set-interval";
import * as targz from "targz";
import {
	IDifficultyInfo,
	ISecureInfo,
	ITransaction,
	SpellRPCError,
} from "../..";
import { kdf } from "../utilities/crypto";
import Account from "./account";
import AverageBlockTime from "./average_block_time";
import { Base } from "./base";
import ChannelCodes from "./channel_codes";
import { KEY_WALLET_EXIST } from "./db_schema";
import Elld from "./elld";
import ErrCodes from "./errors";
import { makeMenu } from "./menu";
import Preference, { PrefMinerOn, PrefSyncOn } from "./preference";
import Transactions from "./transactions";
import Wallet from "./wallet";

/**
 * Returns the file path of the wallet
 * @returns {string}
 */
function getWalletFilePath(): string {
	return path.join(app.getPath("userData"), "wallet", "wallet");
}

/**
 * Returns the directory where the wallet is stored
 * @returns {string}
 */
function getWalletDir(): string {
	return path.join(app.getPath("userData"), "wallet");
}

/**
 * App represents the back-end
 * of the application
 *
 * @export
 * @class App
 * @extends {Base}
 */
export default class App extends Base {
	public db: Datastore;
	public win: Electron.BrowserWindow | undefined;
	public wallet: Wallet | undefined;
	private kdfPass: Uint8Array = new Uint8Array([]);
	private elld: Elld | undefined;
	private transactions: Transactions;
	private preference: Preference;

	constructor() {
		super();
	}

	/**
	 * Returns the electron app.
	 * We could have used Electron app
	 * singleton, but it wouldn't make
	 * testing easy
	 *
	 * @returns
	 * @memberof App
	 */
	public getApp() {
		return app;
	}

	/**
	 * Set the ELLD instance
	 *
	 * @param {Elld} elld
	 * @memberof App
	 */
	public setELLD(elld: Elld) {
		this.elld = elld;
	}

	/**
	 * Run the app engine
	 *
	 * @param {Electron.BrowserWindow} win The render window
	 * @memberof App
	 */
	public async run(win: Electron.BrowserWindow) {
		log.info("Running application");
		const userDir = this.getApp().getPath("userData");

		try {
			log.info("Setting up database and acquiring a reference");
			this.db = new Datastore({
				filename: path.join(userDir, "Database/safehold.db"),
				autoload: true,
			});
			log.info("Database successfully setup");
		} catch (error) {
			log.error("Failed to open database", error.message);
			return;
		}

		// Load the preferences
		log.info("Loading user and application preferences");
		this.preference = new Preference(this.db);
		await this.preference.read();
		log.info("Finished loading preferences");

		this.win = win;
		this.win.setResizable(false);
		this.win.setMaximizable(false);
		Menu.setApplicationMenu(makeMenu(app, false, null));
		log.info("Window and application menu configured");

		// Start listening to events
		this.onEvents();

		// Check whether their is an existing wallet
		const mHasWallet = await Wallet.hasWallet(this.db);
		log.info("Checking for wallet existence", "WalletExist", mHasWallet);
		win.webContents.send(ChannelCodes.AppLaunched, {
			hasWallet: mHasWallet,
		});
	}

	/**
	 * Load the default wallet.
	 *
	 * @private
	 * @param {Uint8Array} passphrase The decryption key
	 * @returns {Promise<Wallet>}
	 * @memberof App
	 */
	public loadWallet(passphrase: Uint8Array): Promise<Wallet> {
		return new Promise((resolve, reject) => {
			fs.readFile(getWalletFilePath(), (err, data) => {
				if (err && this.win) {
					this.sendError(this.win, {
						code: ErrCodes.FailedToReadWallet.code,
						msg: ErrCodes.FailedToReadWallet.msg,
					});
					return reject(err);
				}
				try {
					const walletData = Wallet.decrypt(passphrase, data);
					this.kdfPass = passphrase;
					return resolve(Wallet.inflate(walletData));
				} catch (error) {
					return reject(error);
				}
			});
		});
	}

	/**
	 * Stop the application
	 *
	 * @memberof App
	 */
	public stop() {
		if (this.elld) {
			this.elld.stop();
		}
	}

	/**
	 * restoreAccounts attempts to traverse the HD key
	 * path, looking for account that exists on the chain
	 *
	 * @returns {Promise<void>}
	 * @memberof App
	 */
	// prettier-ignore
	public restoreAccounts(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			// Get entropy and construct the master seed
			const entropy = this.wallet.getEntropy();
			const seed = kdf(entropy, 64);
			const master = HDKey.fromMasterSeed(seed);

			let i = 0;
			const gap = 20;
			let lastActiveIndex = -1;
			let endIndex = 20;
			while (true) {
				if (endIndex === i) {
					if (lastActiveIndex > 0) {
						endIndex = gap + lastActiveIndex + 1;
						lastActiveIndex = -1;
					} else {
						break;
					}
				}
				const hdPath = `m/${i}'`;
				const key = master.derive(hdPath).privateKey();
				try {
					await this.elld.getSpell().ell.getBalance(key.toAddress().toString());
					const account = Account.fromPrivateKey(key);
					account.setHDPath(hdPath);
					account.setName(`Account ${this.wallet.getAccounts().length + 1}`);
					this.wallet.addAccount(account);
					lastActiveIndex = i;
				} catch (e) {
					if (!e.data) { return reject(e); }
					const eObj = JSON.parse(e.data) as SpellRPCError;
					if (eObj.error.code !== 30001) {
						return reject(e);
					}
				}
				i++;
			}
			return resolve();
		});
	}

	private elldOutLogger(data: Buffer) {
		console.log(data.toString("utf8"));
		// log.debug(data.toString("utf-8"));
	}

	private elldErrLogger(data: Buffer) {
		console.log(data.toString("utf8"));
		// log.error(data.toString("utf-8"));
	}

	private normalizeWindow() {
		if (!this.win) {
			return;
		}
		this.win.hide();
		this.win.setResizable(true);
		this.win.setMaximizable(true);
		this.win.setMinimumSize(300, 300);
		this.win.setSize(1300, 1000);
		this.win.center();
		this.win.setBackgroundColor("#eff1f7");
		this.win.show();
	}

	/**
	 * Get difficulty information
	 *
	 * @private
	 * @returns {Promise<IDifficultyInfo>}
	 * @memberof App
	 */
	private getDifficultyInfo(): Promise<IDifficultyInfo> {
		return new Promise(async (resolve, reject) => {
			try {
				const spell = this.elld.getSpell();

				// Get the most recent block
				const tip = await spell.state.getBlock(0);
				const tipNumber = parseInt(tip.header.number, 16);
				const diff = new BigNumber(tip.header.difficulty, 16);
				if (tipNumber === 1) {
					return resolve({
						curDifficulty: diff.toString(),
						prevDifficulty: "0",
					});
				}

				// Get the previous block difficulty
				const prev = await spell.state.getBlock(tipNumber - 1);
				const prevDiff = new BigNumber(prev.header.difficulty, 16);

				return resolve({
					curDifficulty: diff.toString(),
					prevDifficulty: prevDiff.toString(),
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	/**
	 * Start any background process that
	 * is supposed to continue running behind
	 * the scenes.
	 *
	 * @private
	 * @memberof App
	 */
	private startBgProcesses() {
		this.transactions = new Transactions(this.elld.getSpell(), this.db);
		const funcTxsIndexer = async () => {
			Interval.clear("txsIndexer");

			// Get the addresses to be indexed
			const addresses = this.wallet.getAccounts().map((a) => {
				return a.getAddress();
			});

			// Add the addresses to the the indexer and
			// run the index operation
			this.transactions.addAddress(...addresses);
			await this.transactions.index();
			Interval.start(funcTxsIndexer, 15000, "txsIndexer");
		};
		funcTxsIndexer();

		// Run routine to clean up transactions
		// that were indexed but no longer exist
		// on the main chain.
		const funcCleanTxs = async () => {
			Interval.clear("cleanTxs");
			await this.transactions.clean();
			Interval.start(funcCleanTxs, 15000, "cleanTxs");
		};
		funcCleanTxs();
	}

	/**
	 * Get total balance of all accounts
	 *
	 * @private
	 * @returns {Promise<Decimal>}
	 * @memberof App
	 */
	private getTotalAccountsBalance(): Promise<Decimal> {
		const spell = this.elld.getSpell();
		return new Promise(async (resolve, reject) => {
			let totalBalance = new Decimal(0);
			const accounts = this.wallet.getAccounts();
			for (const account of accounts) {
				try {
					// prettier-ignore
					const balance = await spell.ell.getBalance(account.getAddress().toString());
					totalBalance = totalBalance.add(balance.toString());
				} catch (err) {
					if (err.message.match(/.*account not found.*/)) {
						continue;
					}
					return reject(err);
				}
			}
			return resolve(totalBalance);
		});
	}

	/**
	 * Apply user preferences
	 *
	 * @private
	 * @returns
	 * @memberof App
	 */
	private applyPreferences() {
		if (this.preference.get(PrefMinerOn)) {
			ipcMain.emit(ChannelCodes.MinerStart);
		}
		if (!this.preference.get(PrefSyncOn)) {
			ipcMain.emit(ChannelCodes.SyncDisable);
		}
	}

	/**
	 * Listen to incoming events
	 *
	 * @private
	 * @memberof App
	 */
	private onEvents() {
		log.info("Now listening for events");

		// Request to create a new wallet
		ipcMain.on(
			ChannelCodes.WalletNew,
			async (event, secInfo: ISecureInfo) => {
				try {
					await this.makeWallet(secInfo);
					this.kdfPass = secInfo.kdfPass;
					if (this.win) {
						return this.send(
							this.win,
							ChannelCodes.WalletCreated,
							null,
						);
					}
				} catch (error) {
					if (this.win) {
						return this.sendError(this.win, {
							code: ErrCodes.FailedToWriteWallet.code,
							msg: ErrCodes.FailedToWriteWallet.msg,
						});
					}
				}
			},
		);

		// Request to load existing wallet
		ipcMain.on(ChannelCodes.WalletLoad, async (event, kdfPass: Buffer) => {
			try {
				this.wallet = await this.loadWallet(kdfPass);
				if (this.win) {
					try {
						await this.execELLD();
						Menu.setApplicationMenu(makeMenu(app, true, null));
						await this.restoreAccounts();
						await this.startBgProcesses();
						this.applyPreferences();
						this.normalizeWindow();
						// prettier-ignore
						return this.send(this.win, ChannelCodes.WalletLoaded, null);
					} catch (error) {
						log.error("Failed to load walleta", error.message);
					}
				}
			} catch (error) {
				if (this.win) {
					return this.sendError(this.win, {
						code: ErrCodes.FailedToLoadWallet.code,
						msg: ErrCodes.FailedToLoadWallet.msg,
					});
				}
			}
		});

		// Request to for the wallet's entropy
		ipcMain.on(ChannelCodes.WalletGetEntropy, async (event) => {
			// prettier-ignore
			if (!this.wallet) { return log.debug("Wallet not set"); }
			log.debug("Responded to request for wallet entropy");
			event.sender.send(
				ChannelCodes.DataWalletEntropy,
				this.wallet.getEntropy(),
			);
		});

		// Request to finalize the wallet.
		// The wallet is not considered created if not finalized.
		ipcMain.on(ChannelCodes.WalletFinalize, async (event) => {
			this.db.insert({ _id: KEY_WALLET_EXIST }, async (err, doc) => {
				await this.execELLD();
				Menu.setApplicationMenu(makeMenu(app, true, null));
				await this.restoreAccounts();
				await this.startBgProcesses();
				this.applyPreferences();
				this.normalizeWindow();
				return this.send(this.win, ChannelCodes.WalletFinalized, null);
			});
		});

		// Request to quit application
		ipcMain.on(ChannelCodes.AppQuit, () => {
			app.quit();
		});

		// Request to start the miner
		ipcMain.on(ChannelCodes.MinerStart, () => {
			this.preference.set(PrefMinerOn, true);
			this.elld.getSpell().miner.start();
		});

		// Request to stop the miner
		ipcMain.on(ChannelCodes.MinerStop, async () => {
			this.preference.set(PrefMinerOn, false);
			this.elld.getSpell().miner.stop();
		});

		// Request for all wallet accounts
		ipcMain.on(ChannelCodes.AccountsGet, () => {
			const accounts = [];
			this.wallet.getAccounts().forEach((account) => {
				accounts.push({
					address: account.getAddress(),
					isCoinbase: account.isCoinbase(),
					hdPath: account.getHDPath(),
					name: account.getName(),
				});
			});
			return this.send(this.win, ChannelCodes.DataAccounts, accounts);
		});

		// Request to create an account
		ipcMain.on(ChannelCodes.AccountCreate, async () => {
			let newAcct: Account;
			try {
				newAcct = this.wallet.addNewAccount();
				await this.encryptAndPersistWallet(this.kdfPass);
				ipcMain.emit(ChannelCodes.AccountsGet);
				this.send(
					this.win,
					ChannelCodes.AccountRedirect,
					newAcct.getAddress().toString(),
				);
			} catch (err) {
				this.wallet.removeAccount(newAcct);
				return this.sendError(this.win, {
					code: ErrCodes.FailedToPersistNewAccount.code,
					msg: ErrCodes.FailedToPersistNewAccount.msg,
				});
			}
		});

		// Request for overview information
		ipcMain.on(ChannelCodes.OverviewGet, async () => {
			const spell = this.elld.getSpell();
			const curBlock = await spell.state.getBlock(0);
			const coinbase = this.wallet.getCoinbase();
			const peers = await spell.net.getActivePeers();
			const isSyncing = await spell.node.isSyncing();
			const isSyncEnabled = await spell.node.isSyncEnabled();
			const isMining = await spell.miner.isMining();
			const syncStatus = await spell.node.getSyncStat();
			const totalBalance = await this.getTotalAccountsBalance();
			const hashrate = HashrateParser.toString(
				await spell.miner.getHashrate(),
			).split(" ");
			const diffInfo = await this.getDifficultyInfo();
			const averageBlockTime = await AverageBlockTime.calculate(
				this.elld.getSpell(),
			);

			return this.send(this.win, ChannelCodes.DataOverview, {
				currentBlockNumber: parseInt(curBlock.header.number, 16),
				numPeers: peers.length,
				isSyncing,
				isSyncEnabled,
				syncStatus,
				isMining,
				hashrate,
				diffInfo,
				averageBlockTime,
				totalAccountsBalance: totalBalance.toFixed(2),
				coinbase: {
					address: coinbase.getAddress().toString(),
					name: coinbase.getName(),
				},
			});
		});

		// Request for connected peers
		ipcMain.on(ChannelCodes.GetConnectedPeers, async () => {
			const connectedPeers = await this.elld
				.getSpell()
				.net.getActivePeers();

			return this.send(
				this.win,
				ChannelCodes.DataConnectedPeers,
				_.map(connectedPeers, (peer) => {
					return {
						id: peer.id,
						name: peer.name,
						lastSeen: peer.lastSeen,
						isInbound: peer.isInbound,
					};
				}),
			);
		});

		// Request for mined blocks
		ipcMain.on(
			ChannelCodes.GetMinedBlocks,
			async (e, opts: ArgMindedBlock) => {
				const minedBlocks = await this.elld
					.getSpell()
					.state.getMinedBlocks(opts);
				return this.send(
					this.win,
					ChannelCodes.DataMinedBlocks,
					minedBlocks,
				);
			},
		);

		// Request to disable block synchronization
		ipcMain.on(ChannelCodes.SyncDisable, async (e) => {
			await this.elld.getSpell().node.disableSync();
			this.preference.set(PrefSyncOn, false);
			ipcMain.emit(ChannelCodes.OverviewGet);
		});

		// Request to enable block synchronization
		ipcMain.on(ChannelCodes.SyncEnable, async (e) => {
			await this.elld.getSpell().node.enableSync();
			this.preference.set(PrefSyncOn, true);
			ipcMain.emit(ChannelCodes.OverviewGet);
		});

		// Request to update the name of an account
		ipcMain.on(ChannelCodes.AccountNameUpdate, (e, data) => {
			try {
				const account = this.wallet.findAccountByAddress(data.address);
				account.setName(data.newName);
				this.encryptAndPersistWallet(this.kdfPass);
			} catch (err) {
				log.error("Failed to update account name", err);
			}
		});

		// Request for account overview information for a given address
		// prettier-ignore
		ipcMain.on(ChannelCodes.AccountGetOverview, async (e, address: string) => {
			try {
				const account = this.wallet.findAccountByAddress(address);

				let balance: string;
				try {
					const balanceDec = await this.elld.getSpell().ell.getBalance(address);
					balance = balanceDec.toFixed(2);
				} catch (err) {
					if (err.message.match(/.*account not found.*/)) {
						balance = "0";
					} else {
						throw err;
					}
				}

				const totalReceived = await this.transactions.getTotalReceived(address);
				const totalSent = await this.transactions.getTotalSent(address);
				const txsLimit = 3;
				const txsQuery = {address, all: true, limit: 3, sort: {timestamp: -1} };
				const count = await this.transactions.countTxs(txsQuery);
				const txs = await this.transactions.getTxs(txsQuery);
				const pages = Math.ceil(count / txsLimit) || 1;

				this.send(this.win, ChannelCodes.DataAccountOverview, {
					address,
					accountName: account.getName(),
					balance,
					totalReceived,
					totalSent,
					txs,
					hasMoreTxs: pages > 1,
				});

			} catch (err) {
				log.error("Failed to get account overview", err);
			}
		});

		// Request to fetch transactions
		ipcMain.on(
			ChannelCodes.TxsFind,
			async (e, address: string, pageNum: number) => {
				const txsLimit = 3;
				const txsQuery = {
					address,
					all: true,
					limit: 3,
					sort: { timestamp: -1 },
					skip: txsLimit * (pageNum - 1),
				};
				const count = await this.transactions.countTxs(txsQuery);
				const txs = await this.transactions.getTxs(txsQuery);
				const pages = Math.ceil(count / txsLimit) || 1;
				this.send(this.win, ChannelCodes.DataTxs, {
					txs,
					hasMoreTxs: pageNum < pages,
				});
			},
		);

		// Request to force account resynchronization
		ipcMain.on(ChannelCodes.AccountsReSync, async (e) => {
			await this.transactions.clearCursors();
		});
	}

	/**
	 * Setup ELLD binary and launch it
	 *
	 * @private
	 * @memberof App
	 */
	private async execELLD(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				// If the wallet has not been initialized
				// we need to reject the call.
				if (!this.wallet) {
					return reject(new Error("wallet uninitialized"));
				}

				// Check if elld is already running. If so,
				// do not run it again.
				if (this.elld && this.elld.isRunning()) {
					return resolve();
				}

				// Setup ELLD binary and create and instance.
				// Hook data and error callbacks and
				// run ELLD in a different process
				log.info("Setting ELLD environment");
				this.elld = await this.setupELLD();
				this.elld.setCoinbase(this.wallet.getCoinbase());
				this.elld.onData(this.elldOutLogger);
				this.elld.onError(this.elldErrLogger);
				log.info("Finished setting up ELLD environment");
				log.info("Executing ELLD");
				this.elld
					.run([], false)
					.then(resolve)
					.catch(reject);
			} catch (error) {
				if (this.win) {
					this.sendError(this.win, {
						code: ErrCodes.FailedToLoadElldObject.code,
						msg: ErrCodes.FailedToLoadElldObject.msg,
					});
				}
				return reject(error);
			}
		});
	}

	/**
	 * Encrypts and persist the wallet to disk.
	 *
	 * @private
	 * @param {Uint8Array} key
	 * @returns {Promise<boolean>}
	 * @memberof App
	 */
	// prettier-ignore
	private encryptAndPersistWallet(key: Uint8Array): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				const cipherData = this.wallet.encrypt(key);
				mkdirp(getWalletDir(), (err) => {
					if (err) {  return reject(err); }
					fs.writeFile(getWalletFilePath(), cipherData, (err2) => {
						if (err2) { return reject(err2); }
						return resolve(true);
					});
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	/**
	 * Creates the wallet
	 * @private
	 * @param {ISecureInfo} secInfo Includes passphrase for encryption
	 * @memberof App
	 */
	private makeWallet(secInfo: ISecureInfo) {
		return new Promise((resolve, reject) => {
			try {
				this.wallet = new Wallet(secInfo.entropy);
				this.wallet.addNewAccount(true);
				this.encryptAndPersistWallet(secInfo.kdfPass)
					.then(resolve)
					.catch(reject);
			} catch (error) {
				return reject(error);
			}
		});
	}

	/**
	 * Decompress elld binary and return
	 * an instance of Elld.
	 *
	 * @private
	 * @returns {Promise<Elld>}
	 * @memberof App
	 */
	// prettier-ignore
	private setupELLD(): Promise<Elld> {
		return new Promise((resolve, reject) => {
			const elldTarFilePath = path.join(__static, "bin", "elld.tar.gz");
			const dest = path.join(app.getPath("userData"), "elld");
			targz.decompress(
				{ src: elldTarFilePath, dest },
				(err) => {
					if (err) {
						log.error("Failed to decompress ELLD archive", err.message);
						return reject(err);
					}
					return resolve(new Elld(dest));
				},
			);
		});
	}
}
