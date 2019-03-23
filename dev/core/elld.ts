import Spell, { NodeInfo } from '@ellcrys/spell';
import { ChildProcess } from 'child_process';
import spawn from 'cross-spawn';
import randomstring from 'randomstring';
import Account from './account';

const ElldExecName = 'elld';

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
	private numMiners = 1;
	private running = false;
	private coinbase: Account | undefined;
	private spell: Spell;
	private nodeInfo: NodeInfo;
	private networkID = '0002';

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
			throw new Error('spell not initialized');
		}
		return this.spell;
	}

	/**
	 * Set the number of miners
	 *
	 * @param {number} num
	 * @memberof Elld
	 */
	public setNumMiners(num: number) {
		this.numMiners = num;
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
	 * @returns {Promise<NodeInfo>}
	 * @memberof Elld
	 */
	public restart(args = [], noSync = true): Promise<NodeInfo> {
		return new Promise((resolve, reject) => {
			if (!this.elld) {
				throw new Error('elld is not initialized');
			}
			if (!this.running) {
				return this.run(args, noSync)
					.then(resolve)
					.catch(reject);
			}
			this.elld.on('exit', () => {
				this.run(args, noSync)
					.then(resolve)
					.catch(reject);
			});
			this.elld.kill();
		});
	}

	/**
	 * Run ELLD in a child process
	 *
	 * @param {*} [args=[]] The arguments to pass to ELLD
	 * @param {boolean} [noSync=true] If true, --nonet flag is set
	 * @returns {Promise<NodeInfo>}
	 * @memberof Elld
	 */
	public run(args = [], noSync = true): Promise<NodeInfo> {
		return new Promise((resolve, reject) => {
			// Determine the default start command if not set
			if (!args.length) {
				args = [
					'start',
					'--rpc',
					'--rpc-session-ttl',
					'0',
					'-a',
					'127.0.0.1:9000',
					'--net',
					this.networkID,
				];
				if (noSync) {
					args.push('--nonet');
				}
			}

			// Determine the coinbase private key
			let coinbasePrivateKey = '';
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
			const elld = spawn('./elld', args, {
				shell: true,
				cwd: this.execPath,
				env,
			});

			this.elld = elld;

			elld.stdout.on('data', (data: Buffer) => {
				this.running = true;
				if (this.onDataCB) {
					this.onDataCB(data);
				}
			});

			elld.stderr.on('data', (data: Buffer) => {
				this.running = true;
				if (this.onErrorCB) {
					this.onErrorCB(data);
				}
			});

			elld.on('exit', (code: number, signal: string) => {
				this.running = false;
				if (this.onExitCB) {
					this.onExitCB(code, signal);
				}
			});

			// Create a spell object after 1 second
			// and only if the client is still running.
			setTimeout(async () => {
				if (this.running) {
					this.spell = new Spell();
					this.spell
						.provideClient({
							host: '127.0.0.1',
							port: 8999,
							username: rpcUser,
							password: rpcPass,
						})
						.then(async () => {
							try {
								this.nodeInfo = await this.spell.node.info();
								resolve(this.nodeInfo);
							} catch (e) {
								return reject(e);
							}
						})
						.catch(reject);
				} else {
					return reject(new Error('elld not running'));
				}
			}, 1000);
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
