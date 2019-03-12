import Datastore from "nedb";

export default class DBOps {
	/**
	 * Create an instance of DBOps from
	 * a nedb object
	 *
	 * @static
	 * @param {Datastore} db
	 * @returns {DBOps}
	 * @memberof DBOps
	 */
	public static fromDB(db: Datastore): DBOps {
		const dbOps = new DBOps();
		dbOps.db = db;
		return dbOps;
	}

	private db: Datastore;

	/**
	 * Find an item matching the given
	 * query.
	 *
	 * @returns
	 * @memberof DBOps
	 */
	public findOne(query: any) {
		return new Promise((resolve, reject) => {
			this.db.findOne(query, (err, doc) => {
				if (err) {
					return reject(err);
				}
				return resolve(doc);
			});
		});
	}

	/**
	 * Insert a set of docs
	 *
	 * @param {...any[]} docs
	 * @returns
	 * @memberof DBOps
	 */
	public insert(...docs: any[]) {
		return new Promise((resolve, reject) => {
			this.db.insert(docs, (err, newDocs) => {
				if (err) {
					return reject(err);
				}
				return resolve(newDocs);
			});
		});
	}

	/**
	 * Remove docs that match the query
	 *
	 * @param {...any[]} docs
	 * @returns
	 * @memberof DBOps
	 */
	public remove(query: any) {
		return new Promise((resolve, reject) => {
			this.db.remove(query, (err, numRemoved) => {
				if (err) {
					return reject(err);
				}
				return resolve(numRemoved);
			});
		});
	}
}
