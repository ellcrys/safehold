import Spell, { Address } from "@ellcrys/spell";
import queue from "async/queue";
import Decimal from "decimal.js";
import Datastore from "nedb";
import util from "util";
import { ITransactionQuery } from "../..";
import DBOps from "./db_ops";

const TxTypeBalance = 0x1;
const TxTypeAlloc = 0x2;

/**
 * TxIndexer is capable of traversing
 * the Ellcrys blockchain and indexing
 * transactions belonging to a set of
 * accounts.
 *
 * @export
 * @class TxIndexer
 */
export default class TxIndexer {
	private spell: Spell;
	private db: Datastore;

	/**
	 * addresses includes a list
	 * of addresses to track.
	 *
	 * @private
	 * @type {string[]}
	 * @memberof TxIndexer
	 */
	private addresses: string[];

	/**
	 * Creates an instance of TxIndexer.
	 * @param {Spell} spell A spell client
	 * @param {Datastore} db The app database
	 * @memberof TxIndexer
	 */
	constructor(spell: Spell, db: Datastore) {
		this.spell = spell;
		this.db = db;
		this.addresses = [];
	}

	/**
	 * Add one or more addresses whose
	 * transaction information should be
	 * indexed
	 *
	 * @param {...string[]} addresses
	 * @memberof TxIndexer
	 */
	public addAddress(...addresses: string[]) {
		for (const address of addresses) {
			if (!Address.isValid(address)) {
				throw new Error(`invalid address: ${address}`);
			}
			this.addresses.push(address);
		}
	}

	/**
	 * Query transactions
	 * @param {ITransactionQuery} filter
	 * @returns {Promise<any>}
	 * @memberof TxIndexer
	 */
	public getTxs(filter: ITransactionQuery): Promise<any> {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			try {
				const query: any = { _type: "tx" };
				if (filter.received) {
					query.to = filter.address;
				} else if (!filter.all) {
					query.from = filter.address;
				} else {
					delete query._type;
					// prettier-ignore
					query.$and = [
						{ $or: [{ to: filter.address }, { from: filter.address } ]},
						{ _type: "tx" },
					];
				}

				const txs = await dbOps.find(
					query,
					filter.limit,
					filter.skip,
					filter.sort,
				);

				return resolve(txs);
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * Count transactions that match the query
	 *
	 * @param {ITransactionQuery} filter
	 * @returns {Promise<number>}
	 * @memberof TxIndexer
	 */
	public countTxs(filter: ITransactionQuery): Promise<number> {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			try {
				const query: any = { _type: "tx" };
				if (filter.received) {
					query.to = filter.address;
				} else if (!filter.all) {
					query.from = filter.address;
				} else {
					delete query._type;
					// prettier-ignore
					query.$and = [
						{ $or: [{ to: filter.address }, { from: filter.address } ]},
						{ _type: "tx" },
					];
				}

				const count = await dbOps.count(query);
				return resolve(count);
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * Get total balance of received
	 * transactions for the given address.
	 *
	 * @param {string} address
	 * @returns {Promise<string>}
	 * @memberof TxIndexer
	 */
	public getTotalReceived(address: string): Promise<string> {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			try {
				const receivedTxs = await dbOps.find({ to: address });
				let total = new Decimal(0);
				for (const tx of receivedTxs) {
					total = total.add(new Decimal(tx.value));
				}
				return resolve(total.toFixed(2));
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * Get total balance of sent
	 * transactions for the given address.
	 *
	 * @param {string} address
	 * @returns {Promise<string>}
	 * @memberof TxIndexer
	 */
	public getTotalSent(address: string): Promise<string> {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			try {
				const sentTxs = await dbOps.find({ from: address });
				let total = new Decimal(0);
				for (const tx of sentTxs) {
					if (parseInt(tx.type, 16) === TxTypeAlloc) {
						continue;
					}
					total = total.add(new Decimal(tx.value));
				}
				return resolve(total.toFixed(2));
			} catch (err) {
				return reject(err);
			}
		});
	}

	/**
	 * Query the blockchain for transactions
	 * associated with a set of addresses.
	 *
	 * @returns
	 * @memberof TxIndexer
	 */
	public index() {
		return new Promise((resolve, reject) => {
			if (this.addresses.length === 0) {
				resolve();
			}

			// Define a worker queue
			const q = queue(async (address, cb) => {
				this.work(address)
					.then(() => {
						cb();
					})
					.catch(cb);
			}, 5);

			// Add addresses to the queue
			for (const a of this.addresses) {
				q.push(a);
			}

			q.drain = resolve;
		});
	}

	/**
	 * Traverses the blockchain fetching
	 * and storing transactions where the
	 * sender or receiver match the given
	 * address.
	 *
	 * @private
	 * @param {string} address
	 * @returns
	 * @memberof TxIndexer
	 */
	private work(address: string) {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			// Get the last block that was fetched in
			// previous index operation for this address
			const result: any = await dbOps.findOne({
				_id: `txIndexer:lastBlock:${address}`,
			});

			let blockCounter = result ? result.lastBlock : 0;

			// Continuously increment the last block number
			// to fetch the next block till we get to a number
			// that has no block yet.
			while (true) {
				try {
					// Increment the block counter and fetch it
					blockCounter++;
					const block = await this.spell.state.getBlock(blockCounter);
					for (const tx of block.transactions) {
						// Ignore transactions where the sender or the
						// receiver is not the current address.
						if (tx.from !== address && tx.to !== address) {
							continue;
						}

						// Persist the transaction to the database.
						// First we need to modify the transaction object
						// a bit.
						// - Add an object `_type` identifier
						// - Add `_id` property with value of `hash` and delete `hash`
						// - Convert the `timestamp` to number
						(tx as any)._type = "tx";
						(tx as any)._id = tx.hash;
						(tx as any).timestamp = parseInt(
							tx.timestamp as any,
							16,
						);
						delete tx.hash;

						// Store to db.
						// If ever the transaction already exist in the database,
						// insert will throw and error that we will ignore.
						try {
							await dbOps.insert(tx);
						} catch (err) {
							const uniqueKeyErr = /.*Can't insert key.*unique.*/;
							if (!err.message.match(uniqueKeyErr)) {
								throw err;
							}
						}
					}

					// Delete current last block record
					// and update it with the last block number
					await dbOps.remove({
						_id: `txIndexer:lastBlock:${address}`,
					});
					await dbOps.insert({
						_id: `txIndexer:lastBlock:${address}`,
						_type: "tx_indexer_cursor",
						lastBlock: blockCounter,
					});
				} catch (err) {
					// Here, the block was not found.
					// This is not considered an error worth
					// raising alarms to we will stop processing
					// the address here.
					if (err.message.match(/.*block not found.*/)) {
						resolve();
					} else {
						// At this point, some other error occurred.
						// We'll pass that to the callback and also
						// attach the faulty address to the error.
						err.address = address;
						return resolve(err);
					}
					break;
				}
			}
		});
	}
}
