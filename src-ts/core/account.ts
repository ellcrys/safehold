/**
 * Account represents an Ellcrys that
 * holds and manages the native currency
 * @export
 * @class Account
 */
export default class Account {
	/**
	 * The private key
	 *
	 * @private
	 * @type {string}
	 * @memberof Account
	 */
	private privateKey: string = '';

	/**
	 * Returns the account's private key
	 *
	 * @returns {string}
	 * @memberof Account
	 */
	getPrivateKey(): string {
		return this.privateKey;
	}

	/**
	 * Returns the JSON equivalent
	 * of the account
	 * @returns
	 * @memberof Account
	 */
	toJSON() {
		return {
			privateKey: this.privateKey,
		};
	}

	/**
	 * Create an account from an
	 * Ellcrys private key
	 *
	 * @param {string} pk The private key
	 * @returns {Account}
	 * @memberof Account
	 */
	static fromPrivateKey(pk: string): Account {
		const a = new Account();
		a.privateKey = pk;
		return a;
	}
}
