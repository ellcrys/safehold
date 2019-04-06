<template>
  <div id="account-wrapper">
    <div class="statistics-content-wrapper statistics-background-blue">
      <div class="statistics-content-header">
        <div class="statistics-account">
          <strong>{{ this.name }}</strong>
          <span>{{ this.address }}</span>
          <button @click="copyAddress()" style="color:white"></button>
          <span>{{ copyState }}</span>
        </div>

        <div class="statistics-button-set">
          <button @click="openSendModalTx()" class="popup-trigger btn-click-effect">Send</button>
          <button @click="openReceiveAddress()" class="popup-trigger btn-click-effect">Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container no-highlight">
          <div class="statistic">
            <img src="../../assets/icon/noun-account-2065955.svg">
            <div class="data">
              <h1>
                <sub>{{ formatMoney(balance) }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Account Balance</span>
            </div>
          </div>

          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-3.svg">
            <div class="data">
              <h1>
                <sub>{{ formatMoney(totalReceived) }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total ELL Received</span>
            </div>
          </div>

          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-2.svg">
            <div class="data">
              <h1>
                <sub>{{ formatMoney(totalSent) }}</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total ELL Sent</span>
            </div>
          </div>
        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">
          <div class="status">
            <p>Wallet HD Path:</p>
            <span class="path">{{ computeHdPath }}</span>
          </div>

          <div class="status">
            <em>Learn</em>
            <p class="float-right">
              <carousel
                :data="data"
                :controls="false"
                :indicators="false"
                :interval="3000"
                direction="left"
              ></carousel>
            </p>
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

            <li
              v-bind:class="{ active: tab == 'unconfirmed' }"
              class="btn-click-effect"
              v-on:click="switchTabs('unconfirmed')"
            >
              <span>Unconfirmed</span>
            </li>
          </ul>
        </div>

        <div class="data-activity-main">
          <div v-if="!getTxs.length" class="no-content-notice text-muted">
            <img src="../../assets/img/emptyspace_connectedpeers.svg">
            <h1>No Activity</h1>
            <span>Your node is not currently connected to a peer.</span>
            <span>This will change shortly.</span>
          </div>

          <table class="data-table">
            <thead v-if="getTxs.length >= 1">
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
                <td>
                  <a
                    v-on:click.prevent.stop="openURI('https://ellscan.com/search?q=' + tx._id)"
                  >{{ shortenTxHash(tx._id) }}</a>
                </td>
                <td>{{ shortenAddress(tx.from) }}</td>
                <td>{{ shortenAddress(tx.to) }}</td>
                <td>{{ formatMoney(toFixed(tx.value, 2)) }}</td>
                <td>{{ unixToCalendarDate(tx.timestamp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="footer">
      <button v-if="showMore" v-on:click="moreTxs" class="data-show-more btn-click-effect">Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Mixin from './Mixin';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IAccountOverviewData, IAccountData } from '../../../..';
import { ModalReceiveOpen, ModalSendOpen } from '../constants/events';

import * as carousel from '@chenfengyuan/vue-carousel';

const copy = require('copy-to-clipboard');

var refreshInt;

export default {
	mixins: [Mixin],

	components: {
		carousel,
	},
	data() {
		return {
			copyState: '',
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
			// unconfirmedTx: [],
			mainAccount: {
				hdPath: '',
			},
			unConfirmedTx: {
				page: 1,
				hasMoreTxs: false,
				tx: [],
				allTx: [],
				megeAccountTxLen: 0,
			},
			data: [
				'<strong>Account Balance:</strong>&nbsp;This is the total balance in this account.',
				'<strong>Total ELL Received:</strong>&nbsp;The total amount of ELL received on this account.',
				'<strong>Total ELL Sent:</strong>&nbsp;The total amount of ELL sent from this account.',
			],
		};
	},

	// created is a lifecycle method of vue.
	// It reacts by:
	// - listening for events of interest
	// - Request for the data of the account.
	// - Load all account in the wallet
	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
		this.loadAccount();
		ipcRenderer.send(ChannelCodes.AccountsGet);
	},

	computed: {
		// showMore handles logic for
		// showing the showMore button

		showMore() {
			if (this.hasMoreTxs && this.tab == '') {
				return true;
			}
			if (this.unConfirmedTx.hasMoreTxs && this.tab == 'unconfirmed') {
				return true;
			}

			return false;
		},
		// getTxs filters the transactions managed
		// in this component. It filters based on the
		// selected tab and time filter values.
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

				case 'unconfirmed':

					txs =  _.filter(this.unConfirmedTx.tx, (tx): any => {
						return tx.from == this.address;
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
		},

		computeHdPath: function() {
			return this.mainAccount.hdPath.split('/').join(' / ');
		},
	},

	watch: {
		$route: 'loadAccount',
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataAccountOverview, this.onDataAccountOverview);
		ipcRenderer.removeListener(ChannelCodes.DataTxs, this.onMoreTxs);
		ipcRenderer.removeListener(ChannelCodes.TransactionUncomfirmed, this.onTransactionUncomfirmed)
		ipcRenderer.removeListener(ChannelCodes.DataAccounts, this.onDataAccounts);
	},
	mounted() {
		if (this.$route.params.switchTabTo === 'unconfirmed') {
			this.switchTabs('unconfirmed');
		}
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
			ipcRenderer.on(ChannelCodes.DataAccountOverview,this.onDataAccountOverview);
			ipcRenderer.on(ChannelCodes.DataTxs, this.onMoreTxs);
			ipcRenderer.on(ChannelCodes.TransactionUncomfirmed, this.onTransactionUncomfirmed)
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onDataAccounts);
		},

		// onTransactionUncomfirmed fill the unConfirmed
		// transaction array by listen to TransactionUncomfirmed
		// events
		onTransactionUncomfirmed(e, data: any) {
			// stop execution of the routine if the length of incoming
			//  records is the same as the length of existing record
			if (data.length === this.unConfirmedTx.megeAccountTxLen) {
				return false;
			}

			let txData = [];
			const address = this.$route.params.address;

			// fill the txData array with only transactions
			// belonging to the specified address
			for (let i = 0; i < data.length; i++) {
				if (data[i].from === this.$route.params.address) {
					let dataObj = data[i];
					dataObj['_id'] = data[i].hash;
					txData.push(dataObj);
				}
			}

			// order transaction by timestamp decending
			txData = _.orderBy(txData, ['timestamp'], ['desc']);

			// number of records to increment
			const txsLimit = 3;

			// get the number of pages
			const pages = Math.ceil(txData.length / txsLimit) || 1;

			// check if we still have more pages to load
			this.unConfirmedTx.hasMoreTxs = this.unConfirmedTx.page < pages;

			// load athe transaction data
			this.unConfirmedTx.tx = txData;

			// if we still have more transaction to load
			//  then take the first limit of the transaction
			// and display it
			if (this.unConfirmedTx.hasMoreTxs) {
				this.unConfirmedTx.tx = _.take(txData, txsLimit);
			}

			// store all the transaction data
			this.unConfirmedTx.allTx = txData;

			// store the length of incoming data
			this.unConfirmedTx.megeAccountTxLen = data.length;
		},

		// reset changes the state fields of this component to
		// their zero value.
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

		// load the account described by the address
		// specified in the current route. Also, begin
		// the state refresh mechanism.
		loadAccount() {
			this.reset();
			this.address = this.$route.params.address;
			this.refresh();
		},

		// refresh periodically updates the state of the component
		refresh() {
			clearInterval(refreshInt);
			ipcRenderer.send(ChannelCodes.AccountGetOverview, this.address);
			refreshInt = setInterval(() => {
				this.refresh();
			}, 15000);
		},

		// onDataAccountOverview is called when DataAccountOverview event is received.
		// DataAccountOverview is emitted from the main process and includes
		// basic information about the currently loaded account.
		onDataAccountOverview(e, data: IAccountOverviewData) {
			this.name = data.accountName;
			this.balance = data.balance;
			this.totalReceived = data.totalReceived;
			this.totalSent = data.totalSent;
			if (this.txs.length == 0 || this.page === 1) {
				this.txs = data.txs;
				this.hasMoreTxs = data.hasMoreTxs;
			}
		},

		// onDataAccounts is called when DataAccounts event is received.
		// It contains all the accounts registered in this wallet
		// We need to get the hdpath of the address supplied from the accounts
		onDataAccounts(e, accounts: IAccountData[]) {
			for (let i = 0; i < accounts.length; i++) {
				if (accounts[i].address === this.$route.params.address) {
					this.mainAccount = {
						hdPath: accounts[i].hdPath,
					};
					break;
				}
			}
		},

		// onMoreTxs is called when DataTxs event is received.
		// It includes more transactions which was requested by
		// previous emission of TxsFind event.
		onMoreTxs(e, data: IAccountOverviewData) {
			this.txs = this.txs.concat(data.txs);
			this.hasMoreTxs = data.hasMoreTxs;
			this.page += 1;
		},

		// moreTxs is called when the more `button` is triggered.
		// It fires depending on which tabs is opened
		// It emits a TxsFind to the main process passing the
		// addres of the account and the next page to fetch.
		// or fire moreUnconfirmedTxs function to
		//load more unconfirmed transactions
		moreTxs() {
			if (this.tab == '') {
				ipcRenderer.send(
					ChannelCodes.TxsFind,
					this.address,
					this.page + 1,
				);
			} else {
				this.moreUnconfirmedTxs(this.unConfirmedTx.page + 1);
			}
		},

		// moreUnconfirmedTxs load other unconfirmed trasactions
		// and show them in the unconfirmed tab
		moreUnconfirmedTxs(page) {
			// limit of record per load
			const txsLimit = 3;

			// numRecords is the number of records to load
			const numRecords = page * txsLimit;

			// if numRecords is greater than or equal to
			// tunConfirmedTx.allTx then display the whole transaction
			// and hide the showMore button for unconfirmTab
			if (numRecords >= this.unConfirmedTx.allTx.length) {
				// load all the records
				this.unConfirmedTx.tx = this.unConfirmedTx.allTx;

				// hide the showMore button
				this.unConfirmedTx.hasMoreTxs = false;
			} else {
				// if numRecords is less than unConfirmedTx.allTx
				// return only the number of records requested
				this.unConfirmedTx.tx = _.take(
					this.unConfirmedTx.allTx,
					numRecords,
				);

				// set the hasMoreTxs to true to continue
				// showing the show more button
				this.unConfirmedTx.hasMoreTxs = true;

				// increase the page number by 1
				this.unConfirmedTx.page = this.unConfirmedTx.page + 1;
			}
		},

		// switchTabs updates the tab variable that
		// causes the tabs to be switched.
		switchTabs(name: string) {
			this.tab = name;
		},

		// filterByTime sets the current time filter name.
		filterByTime(filterName) {
			this.timeFilter = filterName;
		},

		// openReceiveAddress is called when the `receive` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ReceiveTxn` modal to open.
		openReceiveAddress() {
			this.$bus.$emit(ModalReceiveOpen, {
				address: this.address,
				location: 'account',
			});
		},

		// openSendModalTx is called when the `send` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ModalSendOpen` modal to open.
		openSendModalTx() {
			this.$bus.$emit(ModalSendOpen, {
				address: this.address,
				location: 'account',
			});
		},

		copyAddress() {
			copy(this.address);
			let self = this;
			self.copyState = '✓';

			setTimeout(function() {
				self.copyState = '';
			}, 3000);
		},
	},
};
</script>
