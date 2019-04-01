import Spell, { NodeInfo } from "@ellcrys/spell";
import retry from "async/retry";
import { ChildProcess } from "child_process";
import spawn from "cross-spawn";
import log from "electron-log";
import randomstring from "randomstring";
import Account from "./account";

const ElldExecName = "elld";

type DataCB = (data: Buffer) => void;
type ExitCB = (code: number, signal: string) => void;

/**
 * Elld provides functions to start an ELLD client
 * process and to conveniently interact with it.
 *
 * @export
 * @class Elld
 */
export default class Elld {
	private execPath: string;
	private elld: ChildProcess | undefined;
	private onDataCB: DataCB | undefined;
	private onErrorCB: DataCB | undefined;
	private onExitCB: ExitCB | undefined;
	private running = false;
	private coinbase: Account | undefined;
	private spell: Spell;
	private nodeInfo: NodeInfo;
	private networkID = "0002";

	/**
	 * Create an ELLD client object
	 * @param {string} execPath The path where the ELLD executable is located
	 * @memberof Elld
	 */
	constructor(execPath: string) {
		this.execPath = execPath;
	}

	/**
	 * Returns the spell client to
	 *
	 * @returns {Spell}
	 * @memberof Elld
	 */
	public getSpell(): Spell {
		if (!this.spell) {
			throw new Error("spell not initialized");
		}
		return this.spell;
	}

	/**
	 * Set the coinbase account
	 *
	 * @param {Account} coinbase
	 * @memberof Elld
	 */
	public setCoinbase(coinbase: Account) {
		this.coinbase = coinbase;
	}

	/**
	 * Restart ELLD
	 *
	 * @param {*} [args=[]] The arguments to pass to ELLD
	 * @param {boolean} [noSync=true] If true, --nonet flag is set
	 * @returns {Promise<void>}
	 * @memberof Elld
	 */
	// prettier-ignore
	public restart(args = [], noSync = true): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.elld) { throw new Error("elld is not initialized"); }
			if (!this.running) { return this.run(args, noSync).then(resolve).catch(reject); }
			this.elld.on("exit", () => { this.run(args, noSync).then(resolve).catch(reject); });
			this.elld.kill();
		});
	}

	/**
	 * Run ELLD in a child process
	 *
	 * @param {*} [args=[]] The arguments to pass to ELLD
	 * @param {boolean} [noSync=true] If true, --nonet flag is set
	 * @returns {Promise<void>}
	 * @memberof Elld
	 */
	// prettier-ignore
	public run(args = [], noSync = true): Promise<void> {
		return new Promise((resolve, reject) => {
			// Determine the default start command if not set
			if (!args.length) {
				args = [
					"start",
					"--rpc",
					"--rpc-session-ttl",
					"0",
					"-a",
					"0.0.0.0:9000",
					"--net",
					this.networkID,
				];
				if (noSync) {
					args.push("--nonet");
				}
			}

			// Determine the coinbase private key
			let coinbasePrivateKey = "";
			if (this.coinbase) {
				coinbasePrivateKey = this.coinbase.getPrivateKey().toBase58();
			}

			// Generate random RPC username and password.
			// Using the default credentials will expose the
			// embedded client to be accessible to other
			// applications
			const rpcUser = randomstring.generate(32);
			const rpcPass = randomstring.generate(32);
			const env = {
				ELLD_NODE_ACCOUNT: coinbasePrivateKey,
				ELLD_RPC_USERNAME: rpcUser,
				ELLD_RPC_PASSWORD: rpcPass,
			};

			console.log(env);

			const elld = spawn("elld", args, { shell: true, cwd: this.execPath, env });
			this.elld = elld;

			// hook a callback to stdout
			elld.stdout.on("data", (data: Buffer) => {
				this.running = true;
				if (this.onDataCB) { this.onDataCB(data); }
			});

			elld.stderr.on("data", (data: Buffer) => {
				this.running = true;
				if (this.onErrorCB) { this.onErrorCB(data); }
			});

			elld.on("exit", (code: number, signal: string) => {
				this.running = false;
				log.info("ELLD has stopped");
				if (this.onExitCB) { this.onExitCB(code, signal); }
			});

			// Create a spell instance pointing to the
			// ELLD client we just started. We will attempt
			// to do this for a while, till we succeed.
			// prettier-ignore
			retry({ times: 50, interval: 200 }, (cb) => {
				if (!this.running) { return cb(new Error("Elld is not running")); }
				this.spell = new Spell();
				this.spell.provideClient({
					host: "127.0.0.1",
					port: 8999,
					username: rpcUser,
					password: rpcPass,
				}).then(() => {
					cb(null);
				}).catch((err) => {
					return cb(err);
				});
			}, (err) => {
				if (err) { return reject(err); }
				log.info("ELLD and Spell are running and initialized");
				return resolve(null);
			});
		});
	}

	/**
	 * Get the node information
	 *
	 * @returns {NodeInfo}
	 * @memberof Elld
	 */
	public getNodeInfo(): NodeInfo {
		return this.nodeInfo;
	}

	/**
	 * Subscribe to ELLD stdout stream
	 *
	 * @param {DataCB} cb The callback to pass ELLD output to
	 * @memberof Elld
	 */
	public onData(cb: DataCB) {
		this.onDataCB = cb;
	}

	/**
	 * Subscribe to ELLD stderr stream
	 *
	 * @param {DataCB} cb  The callback to pass ELLD output to
	 * @memberof Elld
	 */
	public onError(cb: DataCB) {
		this.onErrorCB = cb;
	}

	/**
	 * Subscribe to know when ELLD exits
	 *
	 * @param {DataCB} cb  The callback to call on exit
	 * @memberof Elld
	 */
	public onExit(cb: ExitCB) {
		this.onExitCB = cb;
	}

	/**
	 * Stop ELLD process
	 *
	 * @memberof Elld
	 */
	public stop() {
		if (this.elld) {
			this.elld.kill();
		}
	}

	/**
	 * Checks whether the ELLD is running
	 *
	 * @returns
	 * @memberof Elld
	 */
	public isRunning() {
		return this.running;
	}
}
