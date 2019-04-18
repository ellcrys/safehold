<template>
  <div id="container-dashboard">
    <div
      class="top-alert"
      v-bind:class="{ active: !openTopAlert, danger: topAlertErr, success: !topAlertErr }"
    >
      <span>{{ topAlertText }}</span>
      <button v-on:click="openTopAlert = false" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <Header v-bind:accounts="this.accounts"/>
    <div id="main">
      <Sidebar v-bind:accounts="this.accounts"/>
      <div class="content-wrapper-main" id="content-wrapper-main">
        <transition name="slide-left">
          <router-view class="router-view"></router-view>
        </transition>
      </div>

      <div class="go-up-btn d-none" v-on:click="scrollToTop"></div>
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
import {
	ModalConfirmCopyOpen,
	ActiveAccount,
	TopAlertOpen,
	TopAlertOpenErr,
	ModalLoaderClose,
	ModalOnBoardingOpen,
} from '../constants/events';
import { IOverviewData } from '../../../..';
import Mixin from './Mixin';

// refreshInt holds a reference to the
// content refresh interval
let refreshInt;

// refreshDur is the time between each
// content referesh
const refreshDur = 15000;

export default {
	mixins: [Mixin],

	components: {
		Sidebar,
		MinerView,
		Header,
		OverviewView,
		AccountView,
	},

	data() {
		return {
			openTopAlert: false,
			topAlertErr: false,
			topAlertText: '',
			accounts: [],
			isSyncing: false,
		};
	},

	watch: {
		// prettier-ignore
		openTopAlert: function(open) {
			if (!open) { return; }
			setTimeout(() => { this.openTopAlert = false; }, 10000);
		}
	},

	// created is a lifecycle method of vue.
	// It reacts by:
	// - listening for events of interest
	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
	},

	// mounted is called when the component
	// has been mounted. Whe this happens, we
	// redirect to the '/' path and refresh
	// the components state.
	mounted() {
		this.$router.push({ path: '/index', query: this.$route.query });
		this.refresh();
		setTimeout(() => {
			this.$bus.$emit(ModalLoaderClose);
		}, 1000);
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataAccounts, this.onDataAccounts);
		ipcRenderer.removeListener(ChannelCodes.DataOverview, this.onDataOverview);
		ipcRenderer.removeListener(ChannelCodes.AccountRedirect, this.onAccountRedirect);
		ipcRenderer.removeListener(ChannelCodes.TopAlertOpen, this.showTopAlert);
		ipcRenderer.removeListener(ChannelCodes.TopAlertOpenErr, this.showTopAlertErr);
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
			ipcRenderer.on(ChannelCodes.TopAlertOpen, this.showTopAlert);
			ipcRenderer.on(ChannelCodes.TopAlertOpenErr, this.showTopAlertErr);
			this.$bus.$on(TopAlertOpen, this.showTopAlert);
			this.$bus.$on(TopAlertOpenErr, this.showTopAlertErr);
		},

		// showTopAlert opens the top alert for
		// notifying the user about success events.
		showTopAlert(arg1, arg2) {
			this.openTopAlert = true;
			this.topAlertErr = false;
			if (typeof arg1 == 'string') {
				this.topAlertText = arg1;
			} else {
				this.topAlertText = arg2;
			}
		},

		// showTopAlertErr opens the top alert for
		// notifying the user about error events.
		showTopAlertErr(arg1, arg2) {
			this.openTopAlert = true;
			this.topAlertErr = true;
			if (typeof arg1 == 'string') {
				this.topAlertText = arg1;
			} else {
				this.topAlertText = arg2;
			}
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
		onDataOverview(e, data: IOverviewData) {
			this.isSyncing = data.isSyncing;

			// Show the OnBoarding modal
			// check if data.onBoardModalStat is true
			// from the database, then show the modal.

			if (data.onBoardModalStat == true) {
				this.$bus.$emit(ModalOnBoardingOpen);
			}
		},

		// refresh refires some events on interval
		// which will cause the state of the component
		// to change periodically.
		// When syncing, set a faster interval to update
		// the dashboard quicker
		// prettier-ignore
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
