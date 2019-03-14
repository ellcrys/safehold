import Spell, { Address } from "@ellcrys/spell";
import queue from "async/queue";
import Datastore from "nedb";
import util from "util";
import DBOps from "./db_ops";

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
	private onErrorCB: any;

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
	 * Bind to events.
	 * Supported Events:
	 * "error": Receive all error events
	 *
	 * @param {string} event
	 * @param {*} cb
	 * @memberof TxIndexer
	 */
	public on(event: string, cb: any) {
		if (event === "error") {
			this.onErrorCB = cb;
		}
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
	 * Query the blockchain for transactions
	 * associated with a set of addresses.
	 *
	 * @returns
	 * @memberof TxIndexer
	 */
	public index() {
		return new Promise((resolve, reject) => {
			// Define a worker queue
			const q = queue(async (address, cb) => {
				this.work(cb, address);
			}, 5);

			// taskError is called when a task
			// returns an error
			function taskError(err) {
				if (this.onErrorCB) {
					this.onErrorCB(err);
				}
			}

			// Add addresses to the queue
			for (const a of this.addresses) {
				q.push(a, taskError);
			}
		});
	}

	/**
	 * Traverses the blockchain fetching
	 * and storing transactions where the
	 * sender or receiver matches the given
	 * address.
	 *
	 * @private
	 * @param {*} cb
	 * @param {string} address
	 * @returns
	 * @memberof TxIndexer
	 */
	private work(cb: any, address: string) {
		const dbOps = DBOps.fromDB(this.db);
		return new Promise(async (resolve, reject) => {
			// Get the last block that was fetched in
			// previous index operation
			const result: any = await dbOps.findOne({
				_id: "txIndexer:lastBlock",
				address,
			});

			let lastBlock = result ? result.lastBlock : 0;

			// Continuously increment the last block number
			// to fetch the next block till we get to a number
			// that has no block yet.
			while (true) {
				try {
					// Increment the last block and fetch it
					lastBlock++;
					const block = await this.spell.state.getBlock(lastBlock);
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
					await dbOps.remove({ _id: "txIndexer:lastBlock" });
					await dbOps.insert({
						_id: "txIndexer:lastBlock",
						lastBlock,
						address,
					});
				} catch (err) {
					// Here, the block was not found.
					// This is not considered an error worth
					// raising alarms to we will stop processing
					// the address here.
					if (err.message.match(/.*block not found.*/)) {
						cb();
					} else {
						// At this point, some other error occurred.
						// We'll pass that to the callback and also
						// attach the faulty address to the error.
						err.address = address;
						return cb(err);
					}
					break;
				}
			}
		});
	}
}
