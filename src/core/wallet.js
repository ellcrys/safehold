import levelup from 'levelup';
import levelDown from 'leveldown';
import path from 'path';
import moment from 'moment';
/**
 * Wallet is responsible for accessing
 * and mutating wallet information.
 *
 * @export
 * @class Wallet
 */
export default class Wallet {
    /**
     * Creates an instance of Wallet.
     * @memberof Wallet
     */
    constructor() {
        this.createdAt = moment().unix();
        this.unlockedAt = this.createdAt;
        this.version = '1';
        this.accounts = [];
    }
    /**
     * Returns a JSON equivalent of
     * the wallet.
     *
     * @returns
     * @memberof Wallet
     */
    toJSON() {
        let accounts = [];
        this.accounts.forEach(a => {
            accounts.push(a.toJSON());
        });
        return {
            createdAt: this.createdAt,
            unlockedAt: this.unlockedAt,
            version: this.version,
            accounts,
        };
    }
    lock(passphrase) {
    }
    /**
     * Checks whether there is an existing wallet
     *
     * @static
     * @param {string} userDir The
     * @returns {Boolean}
     * @memberof Wallet
     */
    static hasWallet(userDir) {
        return new Promise(async (resolve, reject) => {
            try {
                var db = levelup(levelDown(path.join(userDir, 'db')));
                let walletData = await db.get('user:wallet');
                return resolve(true);
            }
            catch (e) {
                if (e.message.match(/Key not found in database.*/)) {
                    return resolve(false);
                }
                reject(e);
            }
        });
    }
}
//# sourceMappingURL=wallet.js.map