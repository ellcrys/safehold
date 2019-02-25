import blake2 from "blake2";
import { LevelDown } from "leveldown";
import { LevelUp } from "levelup";
import _ from "lodash";
import moment from "moment";
import path from "path";
import { IAccountData, IWalletData } from "../..";
import { decrypt, encrypt } from "../utilities/crypto";
import Account from "./account";
import { KEY_WALLET_EXIST } from "./db_schema";
import { ErrFailedToDecrypt } from "./errors";

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
		const wallet = new Wallet(walletData.seed);
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
	private seed: Buffer;

	/**
	 * Creates an instance of Wallet.
	 * @param {Buffer} seed The seed used to create the master key
	 * @memberof Wallet
	 */
	constructor(seed: Buffer) {
		this.createdAt = moment().unix();
		this.version = "1";
		this.accounts = [];
		this.seed = seed;
	}

	/**
	 * Returns the wallet seed
	 */
	public getSeed(): Buffer {
		return this.seed;
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
			seed: this.seed,
			accounts,
		};
	}

	/**
	 * Encrypt the wallet and all its
	 * records of accounts etc. The
	 * output will be persisted.
	 *
	 * @param {Uint8Array} passphrase The encryption key
	 * @returns {Buffer}
	 * @memberof Wallet
	 */
	public encrypt(passphrase: Uint8Array): Buffer {
		const data = JSON.stringify(this.toJSON());
		const h = blake2.createHash("blake2s");
		const hashedPassphrase = h.update(passphrase).digest();
		const encData = encrypt(hashedPassphrase, Buffer.from(data, "utf-8"));
		return encData;
	}
}
