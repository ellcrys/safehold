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

// Attempt to acquire single app lock.
// If we failed to acquire it, it means an existing instance is open.
let appLock = app.requestSingleInstanceLock();
if (!appLock) {
	app.quit();
} else {
	let mainWindow;
	const safehold = new App();
	const winURL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:9080'
			: `file://${__dirname}/index.html`;

	function createWindow() {
		const winOpts = {
			minWidth: 1000,
			minHeight: 700,
			width: 1060,
			height: 700,
			useContentSize: true,
			backgroundColor: '#0e1321',
		};

		/**
		 * Initial window options
		 */
		mainWindow = new BrowserWindow(winOpts);

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
}
