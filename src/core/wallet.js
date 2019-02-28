import blake2 from "blake2";
import _ from "lodash";
import moment from "moment";
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
    static decrypt(passphrase, encWalletData) {
        const h = blake2.createHash("blake2s");
        const hashedPassphrase = h.update(passphrase).digest();
        const decData = decrypt(hashedPassphrase, encWalletData);
        const isError = _.isError(_.attempt(JSON.parse, decData.toString("utf-8")));
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
    static inflate(walletData) {
        const wallet = new Wallet(walletData.seed);
        wallet.createdAt = walletData.createdAt;
        wallet.version = walletData.version;
        walletData.accounts.forEach((ad) => {
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
    static hasWallet(db) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get(KEY_WALLET_EXIST);
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
    /**
     * Creates an instance of Wallet.
     * @param {Buffer} entropy The seed used to create the master key
     * @memberof Wallet
     */
    constructor(entropy) {
        this.createdAt = moment().unix();
        this.version = "1";
        this.accounts = [];
        this.entropy = entropy;
    }
    /**
     * Returns the wallet entropy
     * used to create the master key
     */
    getEntropy() {
        return this.entropy;
    }
    /**
     * Returns a JSON equivalent of
     * the wallet.
     *
     * @returns
     * @memberof Wallet
     */
    toJSON() {
        const accounts = [];
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
     * @param {Uint8Array} passphrase The encryption key
     * @returns {Buffer}
     * @memberof Wallet
     */
    encrypt(passphrase) {
        const data = JSON.stringify(this.toJSON());
        const h = blake2.createHash("blake2s");
        const hashedPassphrase = h.update(passphrase).digest();
        const encData = encrypt(hashedPassphrase, Buffer.from(data, "utf-8"));
        return encData;
    }
}
//# sourceMappingURL=wallet.js.map