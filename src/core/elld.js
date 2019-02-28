import spawn from "cross-spawn";
const ElldExecName = "elld";
/**
 * Elld provides functions to start an ELLD client
 * process and to conveniently interact with it.
 *
 * @export
 * @class Elld
 */
export default class Elld {
    /**
     * Create an ELLD client object
     * @param {string} execPath The path where the ELLD executable is located
     * @memberof Elld
     */
    constructor(execPath) {
        this.elld = null;
        this.onDataCB = null;
        this.onErrorCB = null;
        this.execPath = execPath;
    }
    /**
     * Run ELLD in a child process
     *
     * @param {string} [cmd="./elld -h"]
     * @memberof Elld
     */
    run(cmd = "./elld account list") {
        this.elld = spawn(cmd, [], {
            shell: true,
            cwd: this.execPath,
        });
        this.elld.stdout.on("data", (data) => {
            if (this.onDataCB) {
                this.onDataCB(data);
            }
        });
        this.elld.stderr.on("data", (data) => {
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
    onData(cb) {
        this.onDataCB = cb;
    }
    /**
     * Subscribe to ELLD stderr stream
     *
     * @param {DataCB} cb  The callback to pass ELLD output to
     * @memberof Elld
     */
    onError(cb) {
        this.onErrorCB = cb;
    }
    /**
     * Stop ELLD process
     *
     * @memberof Elld
     */
    stop() {
        if (this.elld) {
            this.elld.kill();
        }
    }
}
//# sourceMappingURL=elld.js.map