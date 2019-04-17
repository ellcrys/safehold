<template>
  <div id="container" class="index"></div>
</template>

<script lang="ts">
import ChannelCodes from '../../core/channel_codes';
import { ipcRenderer, remote } from 'electron';
import { ModalLoaderOpen } from './constants/events';
import log from 'electron-log';

export default {
	data() {
		return {};
	},

	created() {
		this.onEvents();
	},

	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppLaunched,this.onAppLaunched,);
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		// onAppLaunched is called when the application
		// had just been launched. We respond by navigating
		// to the index page.
		// prettier-ignore
		onAppLaunched(event, msg) {
			log.info("AppLaunched")
			if (msg.hasWallet) { return this.$router.replace('login') }
			return this.$router.replace("signup")
		},

		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onEvents hooks this component to events of interest
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppLaunched, this.onAppLaunched);
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},
	},
};
</script>
