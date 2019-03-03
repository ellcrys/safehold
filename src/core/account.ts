import { PrivateKey } from "@ellcrys/spell";
import { IAccountData } from "../..";
import { encrypt } from "../utilities/crypto";

/**
 * Account represents an Ellcrys that
 * holds and manages the native currency
 * @export
 * @class Account
 */
export default class Account {
	/**
	 * Create an account from an
	 * Ellcrys private key
	 *
	 * @param {PrivateKey} pk The private key
	 * @param {boolean} [coinbase=false] Indicate whether the account is the coinbase
	 * @returns {Account}
	 * @memberof Account
	 */
	public static fromPrivateKey(pk: PrivateKey, coinbase = false): Account {
		const a = new Account();
		a.coinbase = coinbase;
		a.privateKey = pk;
		return a;
	}

	/**
	 * Given an account data from a wallet file,
	 * it will initialize a new Account.
	 *
	 * @static
	 * @param {IAccountData} accountData The account data
	 * @returns {Account}
	 * @memberof Account
	 */
	public static inflate(accountData: IAccountData): Account {
		const account = new Account();
		account.privateKey = PrivateKey.from(accountData.privateKey);
		account.coinbase = accountData.isCoinbase;
		return account;
	}

	/**
	 * The private key
	 *
	 * @private
	 * @type {PrivateKey}
	 * @memberof Account
	 */
	private privateKey: PrivateKey = new PrivateKey();

	/**
	 * Indicates whether the account is the default or
	 * the coinbase account.
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Account
	 */
	private coinbase: boolean = false;

	/**
	 * Returns the account's private key
	 *
	 * @returns {PrivateKey}
	 * @memberof Account
	 */
	public getPrivateKey(): PrivateKey {
		return this.privateKey;
	}

	/**
	 * Returns the JSON equivalent
	 * of the account
	 * @returns
	 * @memberof Account
	 */
	public toJSON(): IAccountData {
		return {
			privateKey: this.privateKey.toBase58(),
			isCoinbase: this.coinbase,
		};
	}

	/**
	 * Checks whether the account is the default
	 * or coinbase account
	 *
	 * @returns {boolean}
	 * @memberof Account
	 */
	public isCoinbase(): boolean {
		return this.coinbase;
	}
}
