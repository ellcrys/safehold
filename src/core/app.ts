import { app, ipcMain } from "electron";
import fs from "fs";
import levelDown, { LevelDown } from "leveldown";
import levelup, { LevelUp } from "levelup";
import path from "path";
import * as targz from "targz";
import { ISecureInfo } from "../..";
import { Base } from "./base";
import ChannelCodes from "./channel_codes";
import { KEY_WALLET_EXIST } from "./db_schema";
import Elld from "./elld";
import ErrCodes from "./errors";
import Wallet from "./wallet";

/**
 * Returns the file path of the wallet
 * @returns {string}
 */
function getWalletFilePath(): string {
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
	public db: LevelUp<LevelDown>;
	public win: Electron.BrowserWindow | undefined;
	public wallet: Wallet | undefined;
	private elld: Elld | undefined;

	constructor() {
		super();
		const userDir = app.getPath("userData");
		this.db = levelup(levelDown(path.join(userDir, "db")));
	}

	/**
	 * Run the app engine
	 *
	 * @param {Electron.BrowserWindow} win The render window
	 * @memberof App
	 */
	public async run(win: Electron.BrowserWindow) {
		this.win = win;
		this.win.setResizable(false);
		this.win.setMaximizable(false);

		// Start listening to events
		this.onEvents();

		// Check whether their is an existing wallet
		const mHasWallet = await Wallet.hasWallet(this.db);
		win.webContents.send(ChannelCodes.AppLaunched, {
			hasWallet: mHasWallet,
		});

		// Load ELLD object
		try {
			this.elld = await this.setupElld();
			this.elld.onData(this.elldOutLogger);
			this.elld.onError(this.elldErrLogger);
			this.elld.run();
		} catch (error) {
			if (this.win) {
				this.sendError(this.win, {
					code: ErrCodes.FailedToLoadElldObject.code,
					msg: ErrCodes.FailedToLoadElldObject.msg,
				});
			}
		}
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
					return resolve(Wallet.inflate(walletData));
				} catch (error) {
					return reject(error);
				}
			});
		});
	}

	public stop() {
		if (this.elld) {
			this.elld.stop();
		}
	}

	private elldOutLogger(data: Buffer) {
		console.log("EllD:Out:", data.toString("utf8"));
	}

	private elldErrLogger(data: Buffer) {
		console.log("EllD:Err:", data.toString("utf8"));
	}

	/**
	 * Listen to incoming events
	 *
	 * @private
	 * @memberof App
	 */
	private onEvents() {
		// Request to create a new wallet
		ipcMain.on(
			ChannelCodes.WalletNew,
			async (event, secInfo: ISecureInfo) => {
				try {
					await this.makeWallet(secInfo);
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
		ipcMain.on(ChannelCodes.WalletLoad, async (event, kdfPass) => {
			try {
				this.wallet = await this.loadWallet(kdfPass);
				if (this.win) {
					return this.send(this.win, ChannelCodes.WalletLoaded, null);
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
		ipcMain.on(ChannelCodes.GetWalletEntropy, async (event, data) => {
			if (this.wallet) {
				event.sender.send(
					ChannelCodes.DataWalletEntropy,
					this.wallet.getEntropy(),
				);
			}
		});

		// Request to finalize the wallet.
		// The wallet is not considered created if not finalized.
		ipcMain.on(ChannelCodes.WalletFinalize, async (event, data) => {
			await this.db.put(KEY_WALLET_EXIST, "1"); // 1 - yes
			if (this.win) {
				return this.send(this.win, ChannelCodes.WalletFinalized, null);
			}
		});

		// Request to quit application
		ipcMain.on(ChannelCodes.AppQuit, () => {
			app.quit();
		});
	}

	/**
	 * Creates the default (only) wallet
	 * @private
	 * @param {ISecureInfo} secInfo Includes passphrase for encryption
	 * @memberof App
	 */
	private makeWallet(secInfo: ISecureInfo) {
		return new Promise((resolve, reject) => {
			const wallet = new Wallet(secInfo.entropy);
			const cipherData = wallet.encrypt(secInfo.kdfPass);
			fs.writeFile(getWalletFilePath(), cipherData, (err) => {
				if (err) {
					return reject(err);
				}
				this.wallet = wallet;
				return resolve(wallet);
			});
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
	private setupElld(): Promise<Elld> {
		return new Promise((resolve, reject) => {
			const elldTarFilePath = path.join(__static, "elld.tar.gz");
			targz.decompress({ src: elldTarFilePath, dest: __static }, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve(new Elld(__static));
			});
		});
	}
}

