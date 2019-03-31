'use strict';

import { app, BrowserWindow } from 'electron';
import App from '../core/app';
import log from 'electron-log';

// require('es6-promise/auto');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path')
		.join(__dirname, '/static')
		.replace(/\\/g, '\\\\');
}

const safehold = new App();

let mainWindow;
const winURL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:9080'
		: `file://${__dirname}/index.html`;

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		minWidth: 1000,
		minHeight: 500,
		width: 1000,
		useContentSize: true,
		backgroundColor: '#0e1321',
	});

	mainWindow.loadURL(winURL);
	mainWindow.webContents.once('did-finish-load', () => {
		log.info('Main window has been loaded. Starting application');
		try {
			safehold.run(mainWindow);
		} catch (error) {
			app.quit();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		safehold.stop();
		app.quit();
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		safehold.stop();
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
