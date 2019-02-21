// 1. Make sure to import 'vue' before declaring augmented types
import Vue from 'vue';
import Electron from 'electron';

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
	// 3. Declare augmentation for Vue
	interface Vue {
		$electron: Electron.App;
	}
}

declare interface IGeneratedMnemonicsInfo {
	mnemonics: string;
	kdfPass: string;
}

declare enum PASSPHRASE_STRENGTH {
	VERY_BAD = 0,
	BAD,
	FAIR,
	GOOD,
	VERY_GOOD,
}
