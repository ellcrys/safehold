import Datastore from "nedb";
import DBOps from "./db_ops";

interface IPreferences {
	minerOn?: boolean;
	syncOn?: boolean;
}

export const PrefMinerOn = "minerOn";
export const PrefSyncOn = "syncOn";

/**
 * Preferences persists and manages
 * user preferences.
 *
 * @export
 * @class Preference
 */
export default class Preference {
	private preferences: IPreferences;
	private db: Datastore;

	/**
	 * Creates an instance of Preference.
	 * @param {Datastore} db The database instance
	 * @memberof Preference
	 */
	constructor(db: Datastore) {
		this.preferences = {
			syncOn: true,
		};
		this.db = db;
	}

	/**
	 * Returns JSOn equivalent of the
	 * stored preferences.
	 *
	 * @returns
	 * @memberof Preference
	 */
	public toJSON() {
		return this.preferences;
	}

	/**
	 * Get a preferences by name.
	 *
	 * @param {string} name
	 * @returns
	 * @memberof Preference
	 */
	public get(name: string) {
		return this.preferences[name];
	}

	/**
	 * Set the value of a preference and persist
	 * the current preferences to the database
	 *
	 * @param {string} name The name of the preference property
	 * @param {*} value The value of the preference property field
	 * @memberof Preference
	 */
	public set(name: string, value: any) {
		return new Promise(async (resolve, reject) => {
			this.preferences[name] = value;
			this.persist()
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * Read existing preferences from the database
	 *
	 * @returns
	 * @memberof Preference
	 */
	public read() {
		return new Promise(async (resolve, reject) => {
			try {
				const dbOps = DBOps.fromDB(this.db);
				const doc = await dbOps.findOne({ _type: "preferences" });
				this.preferences = (doc as any).preferences;
				return resolve();
			} catch (error) {
				return reject(error);
			}
		});
	}

	/**
	 * Store the preferences to the database.
	 *
	 * @private
	 * @memberof Preference
	 */
	// prettier-ignore
	private persist() {
		return new Promise(async (resolve, reject) => {
			try {
				const dbOps = DBOps.fromDB(this.db);
				await dbOps.remove({_type: "preferences"});
				await dbOps.insert({ _type: "preferences", preferences: this.toJSON()});
				return resolve();
			} catch (error) {
				return reject(error);
			}
		});
	}
}
