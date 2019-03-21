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

    <div class="go-up-btn" v-on:click="scrollToTop"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Sidebar from './Sidebar.vue';
import MinerView from './MinerView.vue';
import OverviewView from './OverviewView.vue';
import Header from './Header.vue';
import AccountView from './AccountView.vue';
import Account from '../../../core/account';
import { ModalConfirmCopyOpen, ActiveAccount } from '../constants/events';
import { IOverviewData } from '../../../..';

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

	// created is a lifecycle method of vue.
	// It reacts by:
	// - listening for events of interest
	created() {
		this.onEvents();
	},

	// mounted is called when the component
	// has been mounted. Whe this happens, we
	// redirect to the '/' path and refresh
	// the components state.
	mounted() {
		this.$router.push({ path: '/index' });
		this.refresh();
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataAccounts, this.onDataAccounts);
		ipcRenderer.removeListener(ChannelCodes.DataOverview, this.onDataOverview);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {},

		// onEvents is where subscriptions for various
		// events are made.
		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onDataAccounts);
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
			ipcRenderer.on(ChannelCodes.AccountRedirect, this.onAccountRedirect);
		},

		// onDataAccounts is called when DataAccounts event
		// is received from the main process. It sets a references
		// of the known accounts on this component.
		onDataAccounts(e, accounts: Account[]) {
			this.accounts = accounts;
		},

		// onAccountRedirect is called when AccountRedirect is triggered
		// by the main process. When this happens, the router is redirected
		// to the account page of an account
		onAccountRedirect(e, address: string) {
			this.$router.push({ name: 'account', params: { address } });
		},

		// onDataOverview is called when DataOverview event is received.
		// DataOverview is emitted from the main process and includes
		// basic information to be displayed on the overview pages.
		onDataOverview(e, data: IOverviewData) {},

		// refresh refires some events on interval
		// which will cause the state of the component
		// to change periodically.
		refresh() {
			clearInterval(refreshInt);
			ipcRenderer.send(ChannelCodes.AccountsGet);
			ipcRenderer.send(ChannelCodes.OverviewGet);
			ipcRenderer.send(ChannelCodes.GetConnectedPeers);
			refreshInt = setInterval(() => {
				this.refresh();
			}, refreshDur);
		},


		scrollToTop() {
            // window.scrollTo(0,0);
        },
	},
};
</script>
