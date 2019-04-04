import Datastore from "nedb";

/**
 * DBOpts encapsulates common
 * database operations while
 * support promise-base return
 * value.
 *
 * @export
 * @class DBOps
 */
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
	 * Count items matching the given
	 * query.
	 *
	 * @returns
	 * @memberof DBOps
	 */
	public count(query: any): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.count(query, (err, count) => {
				if (err) {
					return reject(err);
				}
				return resolve(count);
			});
		});
	}

	/**
	 * Find documents matching the
	 * given query.
	 *
	 * @param {*} query The query object
	 * @param {number} [limit=0] Amount of doc to return
	 * @param {number} [skip=0] Set the number of docs to skip
	 * @param {null} sort Sort the result by one or more fields (e.g {time: -1 or 1})
	 * @returns {Promise<any>}
	 * @memberof DBOps
	 */
	public find(
		query: any,
		limit = 0,
		skip = 0,
		sort: { [k: string]: number } = {},
	): Promise<any> {
		return new Promise((resolve, reject) => {
			let q = this.db.find(query);
			if (limit !== 0) {
				q = q.limit(limit);
			}
			if (skip !== 0) {
				q = q.skip(skip);
			}
			if (sort) {
				q = q.sort(sort);
			}
			q.exec((err, docs) => {
				if (err) {
					return reject(err);
				}
				return resolve(docs);
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
			this.db.remove(query, { multi: true }, (err, numRemoved) => {
				if (err) {
					return reject(err);
				}
				return resolve(numRemoved);
			});
		});
	}
}
