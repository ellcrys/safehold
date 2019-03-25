<template>
  <div id="header">
    <div class="content-wrapper-header">
      <div id="search">

		<form  @submit.prevent="search()">
        <input
          type="text"
          v-model="query"
          placeholder="Search for a transaction, account or block">
		</form>
      </div>

      <div id="learn-safehold">
        <span class="tag">New</span>
        <p>Learn SafeHold</p>
        <hr>
        <a href @click.prevent="onboardingModal()">
			Take a look
		</a>
      </div>

      <div id="top-controls-content-wrapper">

        <div id="top-profile" v-if="activeAccount">
          <img :src="(activeAccount) ? makeAvatar(activeAccount.address) : ''">
          <span class="address">{{ (activeAccount) ? activeAccount.name: '' }}</span>
        </div>

        <a id="create-account" class="btn-click-effect" v-on:click="onNewAccountModal">
          +
          <span>Create Account</span>
        </a>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import { Address } from '@ellcrys/spell';
import Mixin from './Mixin';
import {
	ActiveAccount,
	ModalNewAccountOpen,
	ModalOnBoardingOpen,
	ModalOnBoardingClose,
} from '../constants/events';
import { IOverviewData, IActiveAccount } from '../../../..';
const open = require('open');

export default {
	mixins: [Mixin],
	data() {
		return {
			query: '',
			activeAccount: null,
		};
	},

	props: {
		accounts: Array,
	},

	// created is a lifecycle method of vue.
	// It reacts by:
	// - listening for events of interest
	created() {
		this.onEvents();
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.AccountCreate,this.onNewAccount);
		ipcRenderer.removeListener(ChannelCodes.DataOverview,this.onDataOverview);
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
			this.$bus.$on(ActiveAccount, this.setActiveAccount);
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
		},

		// search is called when the enter key is triggered
		// while the search box has had focus
		search() {
			open('https://ellscan.com/search?q=' + this.query);
		},

		// onDataOverview is called when DataOverview event is received.
		// DataOverview is emitted from the main process and includes
		// basic information to be displayed on the overview pages.
		onDataOverview(e, data: IOverviewData) {
			// Set the coinbase account as the active
			// account only when the current route is not
			// an account's page route
			if (this.$route.name != 'account') {
				this.setActiveAccount(data.coinbase);
			}
		},

		// onNewAccount is called when the `create account`
		// button is triggered. It emits AccountCreate event
		// to the main process.
		// onNewAccount() {
		// 	ipcRenderer.send(ChannelCodes.AccountCreate);
		// },

		// onNewAccountModal is called when the `create Account` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ModalNewAccountOpen` modal to open.
		onNewAccountModal() {
			this.$bus.$emit(ModalNewAccountOpen);
		},

		// onboardingModal is called when the `take a look` link
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ModalOnBoardingOpen` modal to open.
		onboardingModal() {
			this.$bus.$emit(ModalOnBoardingOpen);
		},

		// setActiveAccount sets the active account
		setActiveAccount(account: IActiveAccount) {
			this.activeAccount = account;
		},
	},
};
</script>
