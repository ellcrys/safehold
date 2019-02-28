// 1. Make sure to import 'vue' before declaring augmented types
import Electron from "electron";
import Vue from "vue";
import VueRouter, { Route } from "vue-router";

declare const should: any;

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module "vue/types/vue" {
	// 3. Declare augmentation for Vue
	interface Vue {
		$electron: Electron.App;
		$router: VueRouter;
		$route: Route;
	}
}

declare interface ISecureInfo {
	entropy: Buffer;
	kdfPass: Buffer;
}

declare enum PASSPHRASE_STRENGTH {
	VERY_BAD = 0,
	BAD,
	FAIR,
	GOOD,
	VERY_GOOD,
}

declare interface IError {
	code: string;
	msg: string;
	modal?: boolean;
	modalType?: string;
}

declare interface IAccountData {
	privateKey: string;
}

declare interface IWalletData {
	createdAt: number;
	version: string;
	accounts: IAccountData[];
	seed: Buffer;
}
