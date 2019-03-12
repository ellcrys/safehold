<template>
  <div id="container-dashboard">
    <Header v-bind:accounts="this.accounts"/>

    <div id="main">
      <Sidebar v-bind:accounts="this.accounts"/>
      <div class="content-wrapper-main" id="content-wrapper-main">
        <transition name="slide-left">
          <router-view class="router-view"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Sidebar from './Sidebar.vue';
import MinerView from './MinerView.vue';
import Header from './Header.vue';
import OverviewView from './OverviewView.vue';
import AccountView from './AccountView.vue';
import Account from '../../../core/account';

// refreshInt holds a reference to the
// content refresh interval
let refreshInt;

// refreshDur is the time between each
// content referesh
const refreshDur = 15000;

export default {
	components: {
		Sidebar,
		MinerView,
		Header,
		OverviewView,
		AccountView,
	},

	data() {
		return {
			accounts: [],
		};
	},

	created() {
		this.onEvents();
		this.refresh();
	},

	mounted() {
		this.$router.push('index');
		this.refresh();
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(
			ChannelCodes.DataAccounts,
			this.onDataAccounts,
		);
	},

	methods: {
		onAppErr(event, err) {},

		/**
		 * Listen for incoming IPC events
		 */
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onDataAccounts);
		},

		onDataAccounts(e, accounts: Account[]) {
			this.accounts = accounts;
		},

		refresh() {
			clearInterval(refreshInt);
			ipcRenderer.send(ChannelCodes.AccountsGet);
			ipcRenderer.send(ChannelCodes.OverviewGet);
			ipcRenderer.send(ChannelCodes.GetConnectedPeers);
			refreshInt = setInterval(() => {
				this.refresh();
			}, refreshDur);
		},
	},
};
</script>
