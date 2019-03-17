<template>
  <div id="account-wrapper">
    <div class="statistics-content-wrapper statistics-background-blue">
      <div class="statistics-content-header">
        <div class="statistics-account">
          <strong>{{ this.name }}</strong>
          <span>{{ this.address }}</span>
          <button></button>
        </div>

        <div class="statistics-button-set">
          <button class="popup-trigger">Request Test Coins</button>
          <button class="popup-trigger">Send</button>
          <button class="popup-trigger">Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container">
          <div class="statistic">
            <img src="../../assets/icon/noun-account-2065955.svg">
            <div class="data">
              <h1>
                <sub>{{ balance }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Account Balance</span>
            </div>
          </div>

          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-2.svg">
            <div class="data">
              <h1>
                <sub>{{ totalSent }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total transaction sent</span>
            </div>
          </div>

          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-3.svg">
            <div class="data">
              <h1>
                <sub>{{ totalReceived }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total transaction received</span>
            </div>
          </div>
        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">
          <div class="status">
            <p>Block sync:</p>
            <span>Syncing</span>
          </div>

          <div class="status">
            <p>Mining status:</p>
            <span>Starting...</span>
          </div>

          <div class="status">
            <em>New</em>
            <p>Ellscan —</p>
            <strong>Ellcrys Official Block Explorer</strong>
            <p>&nbsp;&nbsp;| Ellscan.com&nbsp;&nbsp;</p>
          </div>
        </div>
      </div>
    </div>

    <div class="table-data-wrapper">
      <div class="data-activity-log">
        <div class="data-activity-header">
          <h3>Account Transactions</h3>

          <ul>
            <span>Filter by:</span>
            <li
              v-on:click="filterByTime('allTime')"
              v-bind:class="{active: timeFilter === 'allTime'}"
              class="btn-click-effect"
            >All Time</li>
            <li
              v-on:click="filterByTime('last1hr')"
              v-bind:class="{active: timeFilter === 'last1hr'}"
              class="btn-click-effect"
            >Last 1 Hour</li>
            <li
              v-on:click="filterByTime('last24hrs')"
              v-bind:class="{active: timeFilter === 'last24hrs'}"
              class="btn-click-effect"
            >Last 24 Hours</li>
            <li
              v-on:click="filterByTime('last3Days')"
              v-bind:class="{active: timeFilter === 'last3Days'}"
              class="btn-click-effect"
            >Last 3 Days</li>
            <li
              v-on:click="filterByTime('last1Week')"
              v-bind:class="{active: timeFilter === 'last1Week'}"
              class="btn-click-effect"
            >Last 1 Week</li>
          </ul>
        </div>

        <div class="data-activity-navigation">
          <ul>
            <li
              v-bind:class="{ active: tab == '' }"
              class="btn-click-effect"
              v-on:click="switchTabs('')"
            >
              <span>All</span>
            </li>
            <li
              v-bind:class="{ active: tab == 'sent' }"
              class="btn-click-effect"
              v-on:click="switchTabs('sent')"
            >
              <span>Sent</span>
            </li>
            <li
              v-bind:class="{ active: tab == 'received' }"
              class="btn-click-effect"
              v-on:click="switchTabs('received')"
            >
              <span>Received</span>
            </li>
          </ul>
        </div>

        <div class="data-activity-main">
          <table class="data-table">
            <thead>
              <tr>
                <th>TX Hash</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(tx) in getTxs" :key="tx._id">
                <td>{{ shortenTxHash(tx._id) }}</td>
                <td>{{ shortenAddress(tx.from) }}</td>
                <td>{{ shortenAddress(tx.to) }}</td>
                <td>{{ toFixed(tx.value, 2) }}</td>
                <td>{{ unixToCalendarDate(tx.timestamp) }}</td>
              </tr>
            </tbody>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="footer">
      <button
        v-if="hasMoreTxs"
        v-on:click="moreTxs"
        class="data-show-more btn-click-effect"
      >Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Mixin from './Mixin';
import * as _ from 'lodash';
import * as moment from 'moment';

export default {
	mixins: [Mixin],
	data() {
		return {
			address: '',
			name: '',
			balance: 0,
			totalReceived: 0,
			totalSent: 0,
			txs: [],
			hasMoreTxs: false,
			page: 1,
			tab: '',
			timeFilter: 'allTime',
		};
	},

	created() {
		this.onEvents();
		this.loadAccount();
	},

	computed: {
		// prettier-ignore
		getTxs() {
			let txs = [];
			// Tab filter
			switch (this.tab) {
				case 'received':
					txs = _.filter(this.txs, (tx): any => {
						return tx.to === this.address;
					});
					break;
				case 'sent':
					txs = _.filter(this.txs, (tx): any => {
						return tx.from === this.address;
					});
					break;
				default:
					txs= this.txs;
			}

			// Time filter
			switch(this.timeFilter) {
				case "last1hr":
					txs = _.filter(txs, (tx): any => {
						return tx.timestamp >= moment().subtract(1, 'h').unix()
					})
				break;
				case "last24hrs":
					txs = _.filter(txs, (tx): any => {
						return tx.timestamp >= moment().subtract(24, 'h').unix()
					})
				break;
				case "last3Days":
					txs = _.filter(txs, (tx): any => {
						return tx.timestamp >= moment().subtract(3, 'd').unix()
					})
				break;
				case "last1Week":
					txs = _.filter(txs, (tx): any => {
						return tx.timestamp >= moment().subtract(1, 'w').unix()
					})
				break;
			}

			return txs
		}
	},

	watch: {
		$route: 'loadAccount',
	},

	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataAccountOverview, this.onDataAccountOverview);
	},

	methods: {
		onAppErr(event, err) {},

		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataAccountOverview,this.onDataAccountOverview);
			ipcRenderer.on(ChannelCodes.DataTxs, this.onMoreTxs);
		},

		reset() {
			this.address = '';
			this.name = '';
			this.balance = 0;
			this.totalReceived = 0;
			this.totalSent = 0;
			this.txs = [];
			this.hasMoreTxs = false;
			this.page = 1;
			this.tab = '';
			this.timeFilter = 'allTime';
		},

		// load the account
		loadAccount() {
			this.reset();
			this.address = this.$route.params.address;
			ipcRenderer.send(ChannelCodes.AccountGetOverview, this.address);
		},

		onDataAccountOverview(e, data) {
			this.name = data.accountName;
			this.balance = data.balance;
			this.totalReceived = data.totalReceived;
			this.totalSent = data.totalSent;
			this.txs = data.txs;
			this.hasMoreTxs = data.hasMoreTxs;
		},

		onMoreTxs(e, data) {
			this.txs = this.txs.concat(data.txs);
			this.hasMoreTxs = data.hasMoreTxs;
			this.page += 1;
		},

		moreTxs() {
			ipcRenderer.send(ChannelCodes.TxsFind, this.address, this.page + 1);
		},

		switchTabs(name: string) {
			this.tab = name;
		},

		filterByTime(filterName) {
			this.timeFilter = filterName;
		},
	},
};
</script>
