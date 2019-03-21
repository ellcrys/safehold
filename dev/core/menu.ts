import { app, Menu, MenuItemConstructorOptions, shell } from "electron";
import * as open from "open";
import path from "path";

function showAppDir() {
	shell.openItem(app.getPath("userData"));
}

function showWalletDir() {
	shell.openItem(path.join(app.getPath("userData"), "wallet"));
}

const template: MenuItemConstructorOptions[] = [
	{
		label: "File",
		submenu: [
			{
				label: "Backup",
				submenu: [
					{ label: "Wallet data", click: showWalletDir },
					{ label: "Application data", click: showAppDir },
				],
			},
		],
	},
	{
		label: "Edit",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "selectall" },
		],
	},
	{
		label: "Develop",
		submenu: [{ role: "toggleDevTools" }],
	},
	{
		role: "Window",
		submenu: [{ role: "minimize" }, { role: "close" }],
	},
	{
		role: "help",
		submenu: [
			{
				label: "Official Website",
				click() {
					open("https://ellcrys.org");
				},
			},
			{
				label: "Official Documentation",
				click() {
					open("https://docs.ellcrys.org");
				},
			},
			{
				label: "Discord Channel",
				click() {
					open("https://discord.gg/PdeJcUD");
				},
			},
			{
				label: "Report an issue on Github",
				click() {
					open("https://github.com/ellcrys/safehold/issues/new");
				},
			},
		],
	},
];

if (process.platform === "darwin") {
	template.unshift({
		label: app.getName(),
		submenu: [
			{ role: "about" },
			{ type: "separator" },
			{ role: "services" },
			{ type: "separator" },
			{ role: "hide" },
			{ role: "hideothers" },
			{ role: "unhide" },
			{ type: "separator" },
			{ role: "quit" },
		],
	});

	// Edit menu
	(template[2].submenu as any[]).push(
		{ type: "separator" },
		{
			label: "Speech",
			submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
		},
	);

	// // Window menu
	template[5].submenu = [
		{ role: "close" },
		{ role: "minimize" },
		{ role: "zoom" },
		{ type: "separator" },
		{ role: "front" },
	];
}

/**
 * Create a menu.
 * @param afterAuth {boolean} Indicates that the menu is
 *  to be used within an authenticated session.
 */
// prettier-ignore
export const makeMenu = (afterAuth: boolean, onNewAccount: () => void) => {
	if (afterAuth) {
		template.splice(3, 0, { label: "View", submenu: [{ role: "togglefullscreen" }]});
		(template[1].submenu as MenuItemConstructorOptions[]).push({ type: "separator" });
		(template[1].submenu as MenuItemConstructorOptions[])
			.push({ label: "New Account", click: onNewAccount });
	}
	return Menu.buildFromTemplate(template as any);
};
