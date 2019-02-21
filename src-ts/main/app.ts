import Wallet from '../core/wallet';
import { app, ipcMain } from 'electron';
import Core from '../core/core';
import { IGeneratedMnemonicsInfo } from '../..';
export class App {
	core: Core;

	constructor() {
		this.core = new Core();
	}

	/**
	 * Run the app engine
	 *
	 * @param {Electron.BrowserWindow} win The render window
	 * @memberof App
	 */
	async run(win: Electron.BrowserWindow) {
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
	private onEvents() {
		ipcMain.on('wallet:new', (event, mnemonicsInfo) => {
			this.makeWallet(mnemonicsInfo);
		});
	}

	private makeWallet(mnemonicsInfo: IGeneratedMnemonicsInfo) {
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
export default function launchApp(win: Electron.BrowserWindow) {
	return new App().run(win);
}
