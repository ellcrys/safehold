<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">
        <!-- Send From Wallet Comienza  -->

        <div class id="send-from-wallet">
          <div class="overlay-content">
            <div class="overlay-header">
              <h1>Send from Ellcrys Wallet</h1>
              <button @click="closeSendModalTx()" class="overlay-close"></button>
            </div>

            <div class="overlay-main">
              <!-- Phase 1 -->
              <div class="phase phase-1" v-if="phase == 'phase1'">
                <div class="error-display" v-if="txError.genErr !== '' ">{{ txError.genErr }}</div>

                <div
                  class="account-switcher"
                  v-bind:class="{ 'expand' : dropDownMenu }"
                  ref="input"
                  @click="openDropDown()"
                >
                  <div class="account-display">
                    <div class="account">
                      <img class="account--photo" :src="makeAvatar(mainAccount.address)">
                      <div class="account--detail">
                        <h3>{{ mainAccount.name }}</h3>
                        <strong>{{ mainAccount.address }}</strong>
                        <span>
                          <em>Bal:</em>
                          {{ mainAccount.balance }} ELL
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="account-wrapper" v-if="accounts.length > 1 && refData.addr === ''">
                    <div
                      class="account"
                      @click="selectedAccount(account.address)"
                      v-for="(account, accountKey) in fAccounts"
                      v-bind:key="accountKey"
                    >
                      <img class="account--photo" :src="makeAvatar(account.address)">
                      <div class="account--detail">
                        <h3>{{ account.name }}</h3>
                        <strong>{{ account.address }}</strong>
                        <span>
                          <em>Bal:</em>
                          {{ account.balance }} ELL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <form action id="send-from-wallet-form" method novalidate>
                  <div class="form-wrapper">
                    <div class="form-element">
                      <label>Amount</label>
                      <span class="accountError" v-if="txError.value !== ''">{{ txError.value }}</span>

                      <div class="amount-input">
                        <input v-model="txDetails.value" type="text" placeholder="0.00">
                        <span>ELL</span>
                      </div>

                      <strong>Invalid Amount</strong>
                    </div>

                    <div class="form-element">
                      <label>Recipient Address</label>
                      <span class="accountError" v-if="txError.addr !== ''">{{ txError.addr }}</span>
                      <input
                        v-model="txDetails.address"
                        type="text"
                        placeholder="e0000000000000..."
                      >
                      <strong>Invalid Address</strong>
                    </div>

                    <div class="form-element">
                      <span class="accountError" v-if="txError.fee !== ''">{{ txError.fee }}</span>

                      <div class="slider-trigger-section">
                        <label>Transaction Fee</label>
                        <!-- <a @click="changeFeeElement()" class="form-tag" href="">
										<span v-if="!feeSlider">Use Feed Slider</span>
										<span v-if="feeSlider">Use text field</span>
                        </a>-->

                        <button @click.prevent="changeFeeElement()" class="slider-trigger">
                          <span v-if="feeSlider">Use Feed Slider</span>
                          <span v-if="!feeSlider">Use Text Field</span>
                        </button>
                      </div>
                      <div class="amount-input" v-if="feeSlider">
                        <input v-model="txDetails.fee" type="text" placeholder="0.03">
                        <span>ELL</span>
                      </div>

                      <div class="amount-slider" v-if="!feeSlider">
                        <button class="left"></button>
                        <VueSlider v-bind="options" v-model="txDetails.fee" :tooltip="'always'"/>
                        <button class="right"></button>
                      </div>

                      <strong>Invalid Amount</strong>
                    </div>

                    <div class="form-element">
                      <button
                        class="split-left-button send-txn-confirm-btn"
                        @click.prevent="toPhase2()"
                        type="submit"
                      >&nbsp; &nbsp;Confirm</button>
                    </div>
                  </div>
                </form>
              </div>

              <div class="phase" v-if="phase == 'phase2'">
                <div class id="transaction-success-wrapper">
                  <img class="overlay-large-image" src="../../assets/img/success.svg">

                  <h2 class="overlay-heading-2">Confirm Transaction</h2>

                  <p>
                    You are sending
                    <strong>{{ txDetails.value}} ELL</strong> to:
                  </p>

                  <p>
                    <span>{{ txDetails.address }}</span>
                  </p>
                  <p>from your account:</p>
                  <p>
                    <span class="active">{{ mainAccount.address }}</span>
                  </p>

                  <div id="transaction-size">
                    <span>
                      <em>Tnx fee</em>
                      {{ txDetails.fee }} ELL
                    </span>
                  </div>

                  <div id="send-receipt-button-group">
                    <button @click="cancelTransaction()">Go Back</button>
                    <button @click="sendTransaction()">Confirm</button>
                  </div>
                </div>
              </div>

              <!-- Phase 2 -->

              <!-- Phase 3 -->
              <div class="phase" v-if="phase == 'phase3'">
                <div id="send-receipt-amount-section">
                  <h1>{{ txResponseObject.value }} ELL</h1>
                  <span>Amount Transacted</span>
                </div>

                <div id="send-receipt-main-content">
                  <div class="txn-hash">
                    <span>Txn Hash:</span>
                    <div>
                      <p>{{ txResponseObject.hash }}</p>
                      <button @click="copyHash(txResponseObject.hash)">Copy {{ copyState }}</button>
                    </div>
                  </div>

                  <div class="account-switcher no-switcher-control" v-if="phase == 'phase2'">
                    <div class="account-display">
                      <div class="account">
                        <div class="account--detail">
                          <h3>Recipient Address</h3>
                          <strong>{{ txDetails.address }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="send-receipt-system-data">
                    <div class="section">
                      <strong>{{ txResponseObject.fee }} ell</strong>
                      <span>Transaction fee</span>
                    </div>

                    <div class="section">
                      <strong>{{ txResponseObject.timestamp | unixToSecondsAgo}}</strong>
                      <span>{{ txResponseObject.timestamp | unixToUTC}}</span>
                    </div>
                  </div>

                  <form action id method novalidate>
                    <div class="form-wrapper">
                      <div class="form-element">
                        <button
                          class="split-left-button"
                          type="submit"
                          @click="finalizeTransaction()"
                        >Continue</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import { ModalSendOpen, ModalSendClose } from '../constants/events';
import { ipcRenderer } from 'electron';
const VueSlider = require('vue-slider-component');
import 'vue-slider-component/theme/default.css';
import ChannelCodes from '../../../core/channel_codes';
import * as _ from 'lodash';
import Mixin from '../dashboard/Mixin';
import {
	IAccountData,
	ITxRequestObj,
	ITxResponseObj,
	IRefData,
} from '../../../../';
const moment = require('moment');
const copy = require('copy-to-clipboard');
import Decimal from 'decimal.js';

import { Address } from '@ellcrys/spell';
import { request } from 'http';
import Vue from 'vue';

export default {
	components: {
		VueSlider,
	},
	mixins: [Mixin],
	data() {
		return {
			open: false,
			copyState: '',
			refData: {
				addr: '',
				location: '',
			},
			dropDownMenu: false,
			options: {
				dotSize: 14,
				width: 'auto',
				height: 4,
				interval: 0.001,
				min: 0.005,
				max: 1,
			},
			mainAccount: {
				name: '',
				hdPath: '',
				balance: '',
				address: '',
				isCoinbase: '',
			},
			accounts: [],
			fAccounts: [],
			txResponseObject: {
				type: '',
				from: '',
				to: '',
				value: '',
				fee: '',
				timestamp: '',
				senderPubKey: '',
				hash: '',
			},
			txDetails: {
				address: '',
				value: '',
				fee: 0.005,
			},
			txError: {
				addr: '',
				fee: '',
				value: '',
				genErr: '',
			},
			phase: 'phase1',
			feeSlider: false,
		};
	},
	watch: {
		// accounts watch when the the accounts array is updated
		// and set the first account as the main account
		accounts: function() {
			if (this.mainAccount.name == '') {
				this.mainAccount = {
					name: this.accounts[0].name,
					hdPath: this.accounts[0].hdPath,
					balance: this.accounts[0].balance,
					address: this.accounts[0].address,
					isCoinbase: this.accounts[0].isCoinbase,
				};

				// return filtered account
				// excluding the main  account
				const res = this.accounts.filter(
					i => i.address !== this.mainAccount.address,
				);

				this.fAccounts = res;
			}
		},
	},

	// created hook
	// - listen to event that open the modal
	// - listen to events that close the modal

	created() {
		this.onEvents();

		// listen to event that opens
		// the sendTransaction Modal
		this.$bus.$on(ModalSendOpen, (data: IRefData) => {
			this.open = true;
			this.refData.addr = data.address;
			this.refData.location = data.location;

			// send event to get all acounts in a wallet
			ipcRenderer.send(ChannelCodes.AccountsGet);
		});

		// listen to events that close the modal
		this.$bus.$on(ModalSendClose, () => {
			this.open = false;
		});
	},

	methods: {
		// created is a lifecycle method of vue.
		// It reacts by:
		// - listening for events of interest

		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onDataAccounts);
			ipcRenderer.on(ChannelCodes.TransactionSend, this.onSendTransactionResponse);
		},

		// copyHash copy a message to the clipboard
		copyHash(msg: string) {
			copy(msg);
			let self = this;
			self.copyState = '✓';

			setTimeout(function() {
				self.copyState = '';
			}, 3000);
		},

		// onDataAccounts gets all the accounts in the wallet
		// and populate the accounts data property
		onDataAccounts(e, accounts: IAccountData[]) {
			// If modal is not open, do not do anything.
			if (!this.open) {
				return;
			}

			this.accounts = accounts;

			if (this.refData.addr === '') {
				return;
			}

			for (let i = 0; i < this.accounts.length; i++) {
				if (this.accounts[i].address === this.refData.addr) {
					this.mainAccount = {
						name: this.accounts[i].name,
						address: this.accounts[i].address,
						balance: this.accounts[i].balance,
						hdPath: this.accounts[i].hdPath,
						isCoinbase: this.accounts[i].isCoinbase,
					};
					break;
				}
			}
		},

		// closeSendModalTx close the sendTransaction modal
		closeSendModalTx() {
			this.dropDownMenu = false;
			this.open = false;
			this.reset();
		},

		// openDropDown opened the dropdown to select accounts
		openDropDown() {
			this.dropDownMenu = !this.dropDownMenu;
		},

		// toPhase2 redirect the user to the confirmation section
		// to confirm the transaction details before sending it.
		toPhase2() {
			this.txError.fee = '';
			this.txError.value = '';
			this.txError.addr = '';

			if (this.txDetails.value <= 0) {
				this.txError.value = 'Amount to send cannot be less than 0';
				return false;
			}

			if (this.txDetails.address === '') {
				this.txError.addr = 'Sender address cannot be empty';
				return false;
			}

			if (!Address.isValid(this.txDetails.address)) {
				this.txError.addr = 'Address must be a valid ellcrys Address';
				return false;
			}

			if (this.txDetails.fee <= 0) {
				this.txError.fee = 'Transaction fee cannot be less than 0';
				return false;
			}

			if (this.mainAccount.balance == 0) {
				this.txError.genErr = 'Insufficient fund, balance is  0';
				return false;
			}

			const txValue = new Decimal(this.txDetails.value);
			const txFee = new Decimal(this.txDetails.fee);

			const totalSend = txValue.add(txFee);
			const balance = new Decimal(this.mainAccount.balance);

			if (totalSend.toPrecision(10) > balance.toPrecision(10)) {
				this.txError.genErr = 'Insufficient fund';
				return false;
			}
			this.phase = 'phase2';
		},

		// reset resets all data property used
		// in processing the transactions
		reset() {
			this.phase = 'phase1';
			this.dropDownMenu = false;

			//reset all  data property
			this.txResponseObject = {
				type: '',
				from: '',
				to: '',
				value: '',
				fee: '',
				timestamp: '',
				senderPubKey: '',
				hash: '',
			};
			this.txDetails = {
				address: '',
				value: '',
				fee: 0,
			};

			this.txError = {
				addr: '',
				fee: '',
				value: '',
				genErr: '',
			};
		},

		// finalize transaction  completes the transaction
		// and reset the data property to default
		finalizeTransaction() {
			this.open = false;
			this.reset();
		},

		//changeFeeElement toggle the selection between slider feed
		// and text field for supplying a fee for a transaction
		changeFeeElement() {
			this.feeSlider = !this.feeSlider;
		},

		// cancelTransaction redirects the sender from the confrimation
		// back to the information page
		cancelTransaction() {
			this.phase = 'phase1';
		},

		// sendTransaction send a specified transaction to the the
		// blockchain network to be be mined
		sendTransaction() {
			const txObject: ITxRequestObj = {
				senderAddr: this.mainAccount.address.toString(),
				recipientAddr: this.txDetails.address.toString(),
				value: this.txDetails.value.toString(),
				txFee: this.txDetails.fee.toString(),
			};

			ipcRenderer.send(ChannelCodes.TransactionSend, txObject);
		},

		// onSendTransactionResponse is called when transaction
		// is send and takes care of the response
		onSendTransactionResponse(e, response: any) {
			if (response.code && response.code !== 0) {
				this.txError.genErr = 'error occoured';
				const msg = response.message.match(/error:(.*)/)[1];

				if (msg !== null) {
					this.txError.genErr = msg;
				}

				this.phase = 'phase1';
				return false;
			}

			if (response.hash.startsWith('0x')) {
				this.txResponseObject = response;
				this.phase = 'phase3';
			}
		},

		// selectedAccount get the address of the selected
		// account in a dropdown containing list of other
		// accounts in a wallet.
		selectedAccount(address: string) {
			for (let i = 0; i < this.accounts.length; i++) {
				if (this.accounts[i].address === address) {
					this.mainAccount = {
						name: this.accounts[i].name,
						address: this.accounts[i].address,
						balance: this.accounts[i].balance,
						hdPath: this.accounts[i].hdPath,
						isCoinbase: this.accounts[i].isCoinbase,
					};
				}
			}

			const res = this.accounts.filter(
				i => i.address !== this.mainAccount.address,
			);

			this.fAccounts = res;
		},
	},

	filters: {
		// unixToSecondsAgo convert a given timestamp
		// to a moment ago equivalent
		unixToSecondsAgo: function(timestamp) {
			const timeAgo = moment(timestamp * 1000).fromNow();
			return timeAgo;
		},

		// unixToUTC convert a given time stamp to a UTC format timestamp equivalent
		unixToUTC: function(timestamp) {
			const utcTime = moment.utc(timestamp * 1000).format('LLLL');
			return utcTime + ' + UTC';
		},
	},
};
</script>
