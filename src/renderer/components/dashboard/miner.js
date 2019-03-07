import { ipcRenderer } from "electron";
import ChannelCodes from "../../../core/channel_codes";
export default class Miner {
    /**
     * Start the miner
     *
     * @memberof Miner
     */
    static startMiner() {
        ipcRenderer.send(ChannelCodes.MinerStart);
    }
    /**
     * Stop the miner
     *
     * @memberof Miner
     */
    static stopMiner() {
        ipcRenderer.send(ChannelCodes.MinerStop);
    }
}
//# sourceMappingURL=miner.js.map