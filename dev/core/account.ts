import { PrivateKey } from '@ellcrys/spell';
import { IAccountData } from '../..';
import { encrypt } from '../utilities/crypto';

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
		account.hdPath = accountData.hdPath;
		account.name = accountData.name;
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
	 * The HD path
	 *
	 * @private
	 * @type {string}
	 * @memberof Account
	 */
	private hdPath: string;

	/**
	 * The account's balance
	 *
	 * @private
	 * @type {string}
	 * @memberof Account
	 */
	private balance: string;

	/**
	 * The name of this account
	 *
	 * @private
	 * @type {string}
	 * @memberof Account
	 */
	private name: string;

	/**
	 * Get the name of this account
	 *
	 * @returns {string}
	 * @memberof Account
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Set the name of the account
	 *
	 * @param {string} name
	 * @memberof Account
	 */
	public setName(name: string): void {
		this.name = name;
	}

	/**
	 * Returns the account's balance
	 *
	 * @returns {string}
	 * @memberof Account
	 */
	public getBalance(): string {
		return this.balance;
	}

	/**
	 * Return the account's balance
	 *
	 * @param {string} balance
	 * @memberof Account
	 */
	public setBalance(balance: string): void {
		this.balance = balance;
	}

	/**
	 * Set HD path
	 *
	 * @param {string} path The hd path (e.g m/0'/1)
	 * @memberof Account
	 */
	public setHDPath(path: string) {
		this.hdPath = path;
	}

	/**
	 * Checks whether the account is equal to o
	 *
	 * @param {Account} o The account being compared to.
	 * @returns {boolean}
	 * @memberof Account
	 */
	public isEqual(o: Account): boolean {
		return this.getPrivateKey()
			.toBuffer()
			.equals(o.getPrivateKey().toBuffer());
	}

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
	 * Return the accounts address
	 *
	 * @returns {string}
	 * @memberof Account
	 */
	public getAddress(): string {
		return this.privateKey.toAddress().toString();
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
			hdPath: this.hdPath,
			name: this.name,
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

	/**
	 * Return HD Path
	 *
	 * @returns
	 * @memberof Account
	 */
	public getHDPath() {
		return this.hdPath;
	}
}
