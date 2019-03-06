import { HDKey, PrivateKey } from "@ellcrys/spell";
import blake2 from "blake2";
import { LevelDown } from "leveldown";
import { LevelUp } from "levelup";
import _ from "lodash";
import moment from "moment";
import path from "path";
import { IAccountData, IWalletData } from "../..";
import { decrypt, encrypt, kdf } from "../utilities/crypto";
import Account from "./account";
import { KEY_WALLET_EXIST } from "./db_schema";
import {
	ErrCoinbaseAccountExists,
	ErrFailedToDecrypt,
	ErrIndexOutOfRange,
	ErrInvalidBitSize,
} from "./errors";

/**
 * Wallet is responsible for accessing
 * and mutating wallet information.
 *
 * @export
 * @class Wallet
 */
export default class Wallet {
	/**
	 * Decrypt a wallet file data
	 *
	 * @static
	 * @param {Uint8Array} passphrase The passphrase to use as decryption key
	 * @param {Buffer} encWalletData The wallet file data
	 * @returns
	 * @throws ErrFailedToDecrypt
	 * @memberof Wallet
	 */
	public static decrypt(
		passphrase: Uint8Array,
		encWalletData: Buffer,
	): IWalletData {
		const h = blake2.createHash("blake2s");
		const hashedPassphrase = h.update(passphrase).digest();
		const decData = decrypt(hashedPassphrase, encWalletData);
		const isError = _.isError(
			_.attempt(JSON.parse, decData.toString("utf-8")),
		);
		if (isError) {
			throw ErrFailedToDecrypt;
		}
		return JSON.parse(decData.toString("utf-8"));
	}

	/**
	 * Given a wallet file data, initialize a new Wallet
	 * instance.
	 *
	 * @static
	 * @param {IWalletData} walletData
	 * @returns {Wallet}
	 * @memberof Wallet
	 */
	public static inflate(walletData: IWalletData): Wallet {
		const wallet = new Wallet(Buffer.from(walletData.seed));
		wallet.createdAt = walletData.createdAt;
		wallet.version = walletData.version;
		walletData.accounts.forEach((ad: IAccountData) => {
			wallet.accounts.push(Account.inflate(ad));
		});
		return wallet;
	}

	/**
	 * Checks whether there is an existing wallet
	 *
	 * @static
	 * @param {LevelUp<LevelDown>} db The database handle
	 * @returns {Boolean}
	 * @memberof Wallet
	 */
	public static hasWallet(db: LevelUp<LevelDown>): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				await db.get(KEY_WALLET_EXIST);
				return resolve(true);
			} catch (e) {
				if (e.message.match(/Key not found in database.*/)) {
					return resolve(false);
				}
				reject(e);
			}
		});
	}

	/**
	 * List of all accounts in the wallet
	 * @memberof Wallet
	 */
	private accounts: Account[];

	/**
	 * The time of creation
	 *
	 * @type {number}
	 * @memberof Wallet
	 */
	private createdAt: number;

	/**
	 * The format version of this wallet
	 *
	 * @type {string}
	 * @memberof Wallet
	 */
	private version: string;

	/**
	 * Seed is used to derive
	 * the wallet's mnemonics and as
	 * the master key for hierarchical
	 * deterministic accounts.
	 *
	 * @private
	 * @type {Buffer}
	 * @memberof Wallet
	 */
	private entropy: Buffer;

	/**
	 * Creates an instance of Wallet.
	 * @param {Buffer} entropy The seed used to create the master key
	 * @memberof Wallet
	 */
	constructor(entropy: Buffer) {
		this.createdAt = moment().unix();
		this.version = "1";
		this.accounts = [];
		this.entropy = entropy;
	}

	/**
	 * Add an account
	 *
	 * @param {Account} account
	 * @memberof Wallet
	 */
	public addAccount(account: Account) {
		this.accounts.push(account);
	}

	/**
	 * Gets an account at a specified index
	 *
	 * @param {number} i The index to check
	 * @returns {Account} The account at the given index
	 * @throws ErrIndexOutOfRange
	 * @memberof Wallet
	 */
	public getAccountAt(i: number): Account {
		if (i + 1 > this.accounts.length) {
			throw ErrIndexOutOfRange;
		}
		return this.accounts[i];
	}

	/**
	 * Returns the accounts in the wallet
	 *
	 * @returns {Account[]}
	 * @memberof Wallet
	 */
	public getAccounts(): Account[] {
		return this.accounts;
	}

	/**
	 * Get the coinbase account
	 *
	 * @returns {(Account | null)} The coinbase account or null if not found
	 * @memberof Wallet
	 */
	public getCoinbase(): Account | null {
		for (const account of this.accounts) {
			if (account.isCoinbase()) {
				return account;
			}
		}
		return null;
	}

	/**
	 * Returns the wallet entropy
	 * used to create the master key
	 */
	public getEntropy(): Buffer {
		return this.entropy;
	}

	/**
	 * Returns a JSON equivalent of
	 * the wallet.
	 *
	 * @returns
	 * @memberof Wallet
	 */
	public toJSON(): IWalletData {
		const accounts: IAccountData[] = [];
		this.accounts.forEach((a) => {
			accounts.push(a.toJSON());
		});
		return {
			createdAt: this.createdAt,
			version: this.version,
			seed: this.entropy,
			accounts,
		};
	}

	/**
	 * Encrypt the wallet and all its
	 * records of accounts etc. The
	 * output will be persisted.
	 *
	 * @param {Uint8Array} passphrase A 64-bit encryption key
	 * @returns {Buffer}
	 * @throws ErrInvalidBitSize when key is less than 64-bits
	 * @memberof Wallet
	 */
	public encrypt(passphrase: Uint8Array): Buffer {
		// We expect a KDF derived passphrase
		// from the caller of up to 64 bits.
		if (passphrase.length < 64) {
			throw ErrInvalidBitSize;
		}

		// Derive a 32-bit encryption key
		const data = JSON.stringify(this.toJSON());
		const h = blake2.createHash("blake2s");
		const hashedPassphrase = h.update(passphrase).digest();
		const encData = encrypt(hashedPassphrase, Buffer.from(data, "utf-8"));
		return encData;
	}

	/**
	 * Create an account which is a child of the master seed
	 * key using the HD path `m/x'`, where x is the index
	 * of the account.
	 *
	 * @param {boolean} [coinbase=false] Set whether the account is a coinbase
	 * @returns {Account}
	 * @throws ErrCoinbaseAccountExists when coinbase is true but another
	 * 			account is marked as coinbase
	 * @memberof Wallet
	 */
	public addNewAccount(coinbase = false): Account {
		// Checks whether an existing coinbase
		// account already exists
		this.accounts.forEach((acct) => {
			if (coinbase && acct.isCoinbase()) {
				throw ErrCoinbaseAccountExists;
			}
		});
		const seed = kdf(this.entropy, 64);
		console.log(this.entropy);
		const numAccounts = this.accounts.length;
		const hdPath = `m/${numAccounts}'`;
		const masterKey = HDKey.fromMasterSeed(seed)
			.derive(hdPath)
			.privateKey();
		const newAcct = Account.fromPrivateKey(masterKey, coinbase);
		newAcct.setHDPath(hdPath);
		this.addAccount(newAcct);

		return newAcct;
	}

	/**
	 * Remove an account from the wallet's account list.
	 * It does not do anything if the account doesn't
	 * exist in the wallet.
	 *
	 * @param {Account} account The account to be removed
	 * @memberof Wallet
	 */
	public removeAccount(account: Account) {
		_.filter(this.accounts, (acct: Account) => {
			return !acct.isEqual(account);
		});
	}
}
