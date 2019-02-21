import levelup from 'levelup';
import levelDown from 'leveldown';
import path from 'path';
import Account from './account';
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
	 * List of all accounts in the wallet
	 * @memberof Wallet
	 */
	accounts: Account[];

	/**
	 * The time of creation
	 *
	 * @type {number}
	 * @memberof Wallet
	 */
	createdAt: number;

	/**
	 * The last time this account was unlocked
	 *
	 * @type {number}
	 * @memberof Wallet
	 */
	unlockedAt: number;

	/**
	 * The format version of this wallet
	 *
	 * @type {string}
	 * @memberof Wallet
	 */
	version: string;

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
		let accounts: any[] = [];
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

	lock(passphrase: string) {
		
	}

	/**
	 * Checks whether there is an existing wallet
	 *
	 * @static
	 * @param {string} userDir The
	 * @returns {Boolean}
	 * @memberof Wallet
	 */
	static hasWallet(userDir: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				var db = levelup(levelDown(path.join(userDir, 'db')));
				let walletData = await db.get('user:wallet');
				return resolve(true);
			} catch (e) {
				if (e.message.match(/Key not found in database.*/)) {
					return resolve(false);
				}
				reject(e);
			}
		});
	}
}
