/**
 * Account represents an Ellcrys that
 * holds and manages the native currency
 * @export
 * @class Account
 */
export default class Account {
    constructor() {
        /**
         * The private key
         *
         * @private
         * @type {string}
         * @memberof Account
         */
        this.privateKey = "";
    }
    /**
     * Create an account from an
     * Ellcrys private key
     *
     * @param {string} pk The private key
     * @returns {Account}
     * @memberof Account
     */
    static fromPrivateKey(pk) {
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
    static inflate(accountData) {
        const account = new Account();
        account.privateKey = accountData.privateKey;
        return account;
    }
    /**
     * Returns the account's private key
     *
     * @returns {string}
     * @memberof Account
     */
    getPrivateKey() {
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
}
//# sourceMappingURL=account.js.map