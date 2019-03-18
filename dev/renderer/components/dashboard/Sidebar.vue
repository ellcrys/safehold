<template>
  <div id="side-navigation-wrapper" class="shift-content-top-mobile">
    <img id="logo" src="../../assets/img/logo.svg">

    <img id="logo-small" src="../../assets/img/logo-small.svg">

    <div id="miner-engine-switch-wrapper">
      <div class="shift-content-top">
        <div class="switch" v-on:click="toggleMiner">
          <button v-bind:class="{on: mining.on }" id="miner-switch"></button>
          <p v-if="!mining.on">Start Mining</p>
          <p v-if="mining.on">Stop Mining</p>
        </div>
      </div>
    </div>

    <div class="shift-content-top">
      <div id="transaction-action-trigger-group">
        <a class="flex popup-trigger" data-target="send-from-wallet">
          <span>Send</span>
        </a>
        <a
          v-on:click="openReceiveAddress"
          class="flex popup-trigger"
          data-target="receive-to-wallet"
        >
          <span>Receive</span>
        </a>
      </div>
    </div>

    <div class="divider"></div>

    <div class="side-nav">
      <div class="nav" v-bind:class="{ active: $route.path == '/index'}">
        <div class="active-indicator" v-if="$route.path == '/index'"></div>
        <div class="shift-content">
          <img src="../../assets/icon/icon-home.svg">
          <strong>
            <a v-on:click="goToPath('/index')">Overview</a>
          </strong>
        </div>
      </div>

      <div class="nav" id="account-nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-customization.svg">
          <strong>
            <a>Accounts</a>
          </strong>
          <span>10</span>
        </div>
        <div
          id="account-nav-wrapper"
          :class="[ subMenu.expandState ? 'expand' : '' ]"
          class="sub-nav-wrapper"
        >
          <a
            href="#"
            v-for="(account) in allAccounts"
            :key="account.address"
            class="sub-nav"
            v-bind:class="{active: activeAddress === account.address}"
            v-on:click.prevent="goToAccount(account.address)"
          >
            <div class="active-indicator" v-if="activeAddress === account.address"></div>
            <div class="shift-content">
              <img :src="makeAvatar(account.address)">
              <input
                type="text"
                :value="account.name"
                :readonly="true"
                v-on:keyup.exact="validateName($event, account.address)"
                v-on:keyup.enter="editAccountName($event, account.address)"
                v-on:dblclick="$event.target.readOnly = false"
                v-on:blur="editAccountName($event, account.address)"
              >
            </div>
          </a>
        </div>
        <div class="shift-content">
          <button @click="seeMoreSideBar()" id="see-more">{{ this.subMenu.menuStatus }}</button>
        </div>
      </div>

      <div class="nav" v-bind:class="{ active: $route.path == '/miner'}">
        <div class="active-indicator" v-if="$route.path == '/miner'"></div>
        <div class="shift-content">
          <img src="../../assets/icon/icon-real-time.svg">
          <strong>
            <a v-on:click="goToPath('/miner')">Miner</a>
          </strong>
        </div>
      </div>
    </div>

    <div class="divider d-none">
      <span>Tools</span>
    </div>

    <div class="side-nav d-none">
      <div class="nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-audience.svg">
          <strong>
            <a href="exportwallet.html">Export Wallets</a>
          </strong>
        </div>
      </div>

      <div class="nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-acquisition-copy.svg">
          <strong>
            <a href="log.html">Log</a>
          </strong>
        </div>
      </div>
    </div>

    <div id="side-nav-footer-content">
      <div class="section">
        <div class="shift-content">
          <p>
            Last Block:
            <span>{{ syncing.currentBlockNumber }}</span>
          </p>
          <div class="roller roller-green">
            <svg viewBox="0 0 36 36">
              <path
                class="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <path
                class="circle"
                :stroke-dasharray="syncing.IsSyncing ? '30 100' : '100 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <text x="18" y="20.35" class="percentage">{{ syncing.IsSyncing ? 30 : 100 }}%</text>
            </svg>
          </div>
        </div>
      </div>

      <div class="section d-none">
        <div class="shift-content">
          <a class="active" href>Refresh account</a>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Account from '../../../core/account';
import Mixin from './Mixin';
import * as _ from 'lodash';
import {
	MinerStarted,
	MinerStopped,
	ModalReceiveAddressOpen,
	ModalReceiveOpen,
	ActiveAccount,
} from '../constants/events';
import { IOverviewData } from '../../../..';

export default {
	props: {
		accounts: Array,
	},

	mixins: [Mixin],

	data() {
		return {
			allAccounts: [],
			activeAddress: '',
			curFocusedAddress: '',
			mining: {
				on: false,
			},
			subMenu: {
				expandState: false,
				menuStatus: 'See More',
			},
			syncing: {
				currentBlockNumber: 1,
				isSyning: false,
			},
		};
	},

	watch: {
		accounts(value) {
			// Do not update account list when an account's
			// name is being updated. This will prevent changes
			// during the update from being lost.
			if (this.curFocusedAddress === '') {
				this.allAccounts = value;
			}
		},
	},

	created() {
		this.onEvents();
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataOverview, this.onDataOverview);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {},

		// onEvents hooks this component to events of interest.
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			this.$bus.$on(MinerStarted, () => (this.mining.on = true));
			this.$bus.$on(MinerStopped, () => (this.mining.on = false));
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
		},

		// openReceiveAddress is called when the `receive` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ReceiveTxn` modal to open.
		openReceiveAddress() {
			this.$bus.$emit(ModalReceiveOpen);
		},

		// toggleMiner is called when the miner button is triggered.
		// It sets the mining status and emits a render-side event
		// MinerStarted to inform other components of the mining status.
		// More importantly, it emits a MinerStart/MinerStop event
		// which will cause the main process to start or stop the miner.
		toggleMiner() {
			this.mining.on = !this.mining.on;
			if (this.mining.on) {
				this.$bus.$emit(MinerStarted);
				return ipcRenderer.send(ChannelCodes.MinerStart);
			}
			this.$bus.$emit(MinerStopped);
			ipcRenderer.send(ChannelCodes.MinerStop);
		},

		// onDataOverview is called when DataOverview event is received.
		// DataOverview is emitted from the main process and includes
		// basic information to be displayed on the overview pages.
		onDataOverview(e, data: IOverviewData) {
			this.syncing.currentBlockNumber = data.currentBlockNumber;
		},

		// validateName is called each time the content
		// of a account item on the sidebar is being changed.
		// It attempts to ensure the maximum size is not exceeded.
		validateName(e, address: string) {
			this.curFocusedAddress = address;
			const value = e.target.value;
			if (value.length > 15) {
				e.target.value = value.substr(0, 15);
			}
		},

		// seeMoreSideBar increases the height of the container
		// that displays all known accounts links. It is capable
		// of expanding or shrinking this container.
		seeMoreSideBar() {
			this.subMenu.expandState = !this.subMenu.expandState;
			if (this.subMenu.expandState === true) {
				this.subMenu.menuStatus = 'See Less';
				return;
			}
			this.subMenu.menuStatus = 'See More';
		},

		// editAccountName  is called when the enter key is triggered
		// on the text input of an account that is being editted.
		editAccountName(e, address) {
			// Set the current focused account/address being editted
			// to empty since focus has been lost on the input field.
			this.curFocusedAddress = '';

			// Revert the input field to readOnly
			e.target.readOnly = true;

			// Find the account with the matching
			// address and update its value.
			const value = e.target.value;
			this.allAccounts = _.map(this.allAccounts, v => {
				if (v.address === address) {
					v.name = value;
				}
				return v;
			});

			// Emit render-side event ActiveAccount to let components
			// know that the active account has changed.
			this.$bus.$emit(ActiveAccount, { name: value, address });

			// Send an AccountNameUpdate event to the main process so
			// it knows to update the account's name to the new one.
			ipcRenderer.send(ChannelCodes.AccountNameUpdate, {
				address,
				newName: value,
			});
		},

		// goToAccount is called when an account link is clicked.
		// It navigates to the accounts page.
		goToAccount(address) {
			for (const account of this.allAccounts) {
				if (account.address === address) {
					this.activeAddress = address;
					let _account = { name: account.name, address };
					this.$bus.$emit(ActiveAccount, _account);
					this.$router.push({ name: 'account', params: { address } });
				}
			}
		},

		// goToPath forces the router to navigate
		// to a given path. It resets the active
		// address before redirecting.
		goToPath(path) {
			this.activeAddress = '';
			this.$router.push({ path });
		},
	},
};
</script>
