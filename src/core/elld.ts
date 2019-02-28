import { ChildProcess } from "child_process";
import spawn from "cross-spawn";

const ElldExecName = "elld";

type DataCB = (data: Buffer) => void;

/**
 * Elld provides functions to start an ELLD client
 * process and to conveniently interact with it.
 *
 * @export
 * @class Elld
 */
export default class Elld {
	private execPath: string;
	private elld: ChildProcess | null = null;
	private onDataCB: DataCB | null = null;
	private onErrorCB: DataCB | null = null;

	/**
	 * Create an ELLD client object
	 * @param {string} execPath The path where the ELLD executable is located
	 * @memberof Elld
	 */
	constructor(execPath: string) {
		this.execPath = execPath;
	}

	/**
	 * Run ELLD in a child process
	 *
	 * @param {string} [cmd="./elld -h"]
	 * @memberof Elld
	 */
	public run(cmd = "./elld account list") {
		this.elld = spawn(cmd, [], {
			shell: true,
			cwd: this.execPath,
		});

		this.elld.stdout.on("data", (data: Buffer) => {
			if (this.onDataCB) {
				this.onDataCB(data);
			}
		});

		this.elld.stderr.on("data", (data: Buffer) => {
			if (this.onErrorCB) {
				this.onErrorCB(data);
			}
		});
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
	 * Stop ELLD process
	 *
	 * @memberof Elld
	 */
	public stop() {
		if (this.elld) {
			this.elld.kill();
		}
	}
}
