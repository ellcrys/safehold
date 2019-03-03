import { PrivateKey } from "@ellcrys/spell";
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
         * @type {PrivateKey}
         * @memberof Account
         */
        this.privateKey = new PrivateKey();
        /**
         * Indicates whether the account is the default or
         * the coinbase account.
         *
         * @private
         * @type {boolean}
         * @memberof Account
         */
        this.coinbase = false;
    }
    /**
     * Create an account from an
     * Ellcrys private key
     *
     * @param {PrivateKey} pk The private key
     * @param {boolean} [coinbase=false] Indicate whether the account is the coinbase
     * @returns {Account}
     * @memberof Account
     */
    static fromPrivateKey(pk, coinbase = false) {
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
    static inflate(accountData) {
        const account = new Account();
        account.privateKey = PrivateKey.from(accountData.privateKey);
        account.coinbase = accountData.isCoinbase;
        return account;
    }
    /**
     * Returns the account's private key
     *
     * @returns {PrivateKey}
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
    isCoinbase() {
        return this.coinbase;
    }
}
//# sourceMappingURL=account.js.map