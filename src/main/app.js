import Wallet from '../core/wallet';
import { app, ipcMain } from 'electron';
import Core from '../core/core';
export class App {
    constructor() {
        this.core = new Core();
    }
    /**
     * Run the app engine
     *
     * @param {Electron.BrowserWindow} win The render window
     * @memberof App
     */
    async run(win) {
        // Start listening to events
        this.onEvents();
        // Check whether their is an existing wallet
        const hasWallet = await Wallet.hasWallet(app.getPath('userData'));
        win.webContents.send('app:launched', {
            hasWallet,
        });
    }
    /**
     * Listen to incoming events
     *
     * @private
     * @memberof App
     */
    onEvents() {
        ipcMain.on('wallet:new', (event, mnemonicsInfo) => {
            this.makeWallet(mnemonicsInfo);
        });
    }
    makeWallet(mnemonicsInfo) {
        const wallet = new Wallet();
        console.log(wallet);
    }
}
/**
 * Launch the application back-end
 *
 * @export
 * @param {Electron.BrowserWindow} win
 * @returns
 */
export default function launchApp(win) {
    return new App().run(win);
}
//# sourceMappingURL=app.js.map