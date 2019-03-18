<template>
  <div id="header">
    <div class="content-wrapper-header">
      <div id="search">
        <input
          type="text"
          v-on:keyup.enter="search"
          v-model="query"
          placeholder="Search for a transaction, account or block"
        >
      </div>

      <div id="learn-safehold">
        <span class="tag">New</span>
        <p>Learn SafeHold</p>
        <hr>
        <a href>Take a look</a>
      </div>

      <div id="top-controls-content-wrapper">
        <div id="top-icons">
          <div class="icon">
            <img id="notification-trigger" src="../../assets/icon/notification_inactive.svg">

            <!-- Notification Drop Down -->
            <div class="drop-down hide" id="notification-drop-down">
              <div class="drop-down-header">
                <h1>Notification</h1>
              </div>

              <div class="drop-down-others">
                <button>Clear All</button>
                <div>
                  <label>Push notifications</label>
                  <select>
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              </div>

              <div class="drop-down-main">
                <div class="drop-down-main-options drop-down-icon-padding">
                  <div class="option active on">
                    <p>
                      You mined
                      <em class="target">#block382729273</em>
                    </p>
                    <span>
                      90.08734 e -
                      <em class="reward">Mining reward</em> •
                      <em class="time">few moments ago</em>
                    </span>
                  </div>

                  <div class="option off">
                    <p>
                      Ye277e…w7272
                      <em class="target">requested for</em> 100 ellies
                    </p>
                    <span>
                      Request
                      <em class="success">successful</em> | Testnet •
                      <em class="time">6 hours ago</em>
                    </span>
                  </div>

                  <div class="option checked">
                    <p>
                      You
                      <em class="target">sent</em> 49.09288
                      <em class="target">to</em> e387p…e9224
                    </p>
                    <span>
                      Transaction
                      <em class="success">successful</em> - Txn fee: 0.03932 •
                      <em class="time">7 hours ago</em>
                    </span>
                  </div>
                </div>
              </div>

              <div class="drop-down-footer">
                <a href="notification.html" class="view-notification">View all notifications</a>
              </div>
            </div>

            <!-- Notification Drop Down -->
          </div>
        </div>

        <div id="top-profile" v-if="activeAccount">
          <img :src="(activeAccount) ? makeAvatar(activeAccount.address) : ''">
          <span class="address">{{ (activeAccount) ? activeAccount.name: '' }}</span>
        </div>

        <a id="create-account" class="btn-click-effect" v-on:click="onNewAccount">
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
import { ActiveAccount } from '../constants/events';
import { IOverviewData, IActiveAccount } from '../../../..';

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
		search() {},

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
		onNewAccount() {
			ipcRenderer.send(ChannelCodes.AccountCreate);
		},

		// setActiveAccount sets the active account
		setActiveAccount(account: IActiveAccount) {
			this.activeAccount = account;
		},
	},
};
</script>
