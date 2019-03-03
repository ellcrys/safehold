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
        this.numMiners = 1;
        this.isRunning = false;
        this.execPath = execPath;
    }
    /**
     * Set the number of miners
     *
     * @param {number} num
     * @memberof Elld
     */
    setNumMiners(num) {
        this.numMiners = num;
    }
    /**
     * Set the coinbase account
     *
     * @param {Account} coinbase
     * @memberof Elld
     */
    setCoinbase(coinbase) {
        this.coinbase = coinbase;
    }
    /**
     * Restart ELLD
     *
     * @param {*} [args=[]] The arguments to pass to ELLD
     * @param {boolean} [noSync=true] If true, --nonet flag is set
     * @memberof Elld
     */
    restart(args = [], noSync = true) {
        if (!this.elld) {
            throw new Error("elld is not initialized");
        }
        if (!this.isRunning) {
            this.run(args, noSync);
            return;
        }
        this.elld.on("exit", () => {
            this.run(args, noSync);
        });
        this.elld.kill();
    }
    /**
     * Run ELLD in a child process
     *
     * @param {*} [args=[]] The arguments to pass to ELLD
     * @param {boolean} [noSync=true] If true, --nonet flag is set
     * @memberof Elld
     */
    run(args = [], noSync = true) {
        // Determine the default start command if not set
        if (!args.length) {
            args = ["start", "--rpc", "-a", "127.0.0.1:9000"];
            if (noSync) {
                args.push("--nonet");
            }
        }
        // Determine the coinbase private key
        let coinbasePrivateKey = "";
        if (this.coinbase) {
            coinbasePrivateKey = this.coinbase.getPrivateKey().toBase58();
        }
        const elld = spawn("./elld", args, {
            shell: true,
            cwd: this.execPath,
            env: {
                ELLD_NODE_ACCOUNT: coinbasePrivateKey,
            },
        });
        this.elld = elld;
        this.isRunning = true;
        elld.stdout.on("data", (data) => {
            if (this.onDataCB) {
                this.onDataCB(data);
            }
        });
        elld.stderr.on("data", (data) => {
            if (this.onErrorCB) {
                this.onErrorCB(data);
            }
        });
        elld.on("exit", (code, signal) => {
            this.isRunning = false;
            if (this.onExitCB) {
                this.onExitCB(code, signal);
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
     * Subscribe to know when ELLD exits
     *
     * @param {DataCB} cb  The callback to call on exit
     * @memberof Elld
     */
    onExit(cb) {
        this.onExitCB = cb;
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