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
	 * @param {string} pk The private key
	 * @returns {Account}
	 * @memberof Account
	 */
	public static fromPrivateKey(pk: string): Account {
		const a = new Account();
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
		account.privateKey = accountData.privateKey;
		return account;
	}

	/**
	 * The private key
	 *
	 * @private
	 * @type {string}
	 * @memberof Account
	 */
	private privateKey: string = "";

	/**
	 * Returns the account's private key
	 *
	 * @returns {string}
	 * @memberof Account
	 */
	public getPrivateKey(): string {
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
			privateKey: this.privateKey,
		};
	}
}
