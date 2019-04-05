<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">
        <div class id="receive-to-wallet">
          <div class="overlay-content">
            <div class="overlay-header">
              <h1>Receive To Ellcrys Wallet</h1>
              <button @click="closeReceiveAddress()" class="overlay-close"></button>
            </div>

            <div class="overlay-main">
              <div
                class="account-switcher"
                v-if="refData.addr === ''"
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
                    v-bind:key="accountKey">
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

              <div id="receive-to-wallet-qr-wrapper">
                <img :src="qrImage">
                <div id="receive-to-wallet-account-section">
                  <span>{{ mainAccount.address }}</span>
                  <button @click="copyAddress(mainAccount.address)">Copy {{ copyState }}</button>
                </div>

                <a href @click.prevent=" openURI('https://ellscan.com/search?q=' + mainAccount.address)">View on Ellscan</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import { ModalReceiveOpen, ModalReceiveClose } from '../constants/events';
import ChannelCodes from '../../../core/channel_codes';
import * as _ from 'lodash';
import Mixin from '../dashboard/Mixin';
import { ipcRenderer } from 'electron';
import { IAccountData, IRefData } from '../../../../';
const QRCode = require('qrcode');

const copy = require('copy-to-clipboard');
export default {
	data() {
		return {
			copyState: '',
			open: false,
			value: 20,
			refData: {
				addr: '',
				location: '',
			},
			dropDownMenu: false,
			mainAccount: {
				name: '',
				hdPath: '',
				balance: '',
				address: '',
				isCoinbase: '',
			},
			accounts: [],
			fAccounts: [],
			qrImage: '',
			opts: {
				color: {
					dark: '#0663FF', // Blue dots
					light: '#0000', // Transparent background
				},
			},
		};
	},
	mixins: [Mixin],
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

				// Generate QrCode for default account
				QRCode.toDataURL(this.accounts[0].address, this.opts)
					.then(url => {
						this.qrImage = url;
					})
					.catch(err => {
						console.error(err);
					});

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

		this.$bus.$on(ModalReceiveOpen, (data: IRefData) => {
			this.open = true;

			this.refData.addr = data.address;
			this.refData.location = data.location;

			// send event to get all acounts in a wallet
			ipcRenderer.send(ChannelCodes.AccountsGet);
		});

		// listen to events that close the modal
		this.$bus.$on(ModalReceiveClose, () => {
			this.open = false;
		});
	},
	methods: {
		// created is a lifecycle method of vue.
		// It reacts by:
		// - listening for events of interest

		onEvents() {
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onDataAccounts);
		},

		// onDataAccounts gets all the accounts in the wallet
		// and populate the accounts data property
		onDataAccounts(e, accounts: IAccountData[]) {
			// load the account data
			this.accounts = accounts;

			// If modal is not open, do not do anything.
			if (!this.open) {
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

					// Generate QrCode for selected account
					QRCode.toDataURL(this.accounts[i].address, this.opts)
						.then(url => {
							this.qrImage = url;
						})
						.catch(err => {
							console.error(err);
						});

					break;
				}
			}

			// return filtered account
			// excluding the main  account
			const res = accounts.filter(
				i => i.address !== this.mainAccount.address,
			);

			this.fAccounts = res;
		},

		// openDropDown opened the dropdown to select accounts
		openDropDown() {
			this.dropDownMenu = !this.dropDownMenu;
		},

		// sendTransaction send a specified transaction to the the
		// blockchain network to be be mined
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

			// Generate QrCode for selected account
			QRCode.toDataURL(this.mainAccount.address, this.opts)
				.then(url => {
					this.qrImage = url;
				})
				.catch(err => {
					console.error(err);
				});

			const res = this.accounts.filter(
				i => i.address !== this.mainAccount.address,
			);

			this.fAccounts = res;
		},

		// closeReceiveAddress close the ReceiveTransaction modal
		closeReceiveAddress() {
			this.dropDownMenu = false;
			this.open = false;
		},

		// copyAddress copy a message to the clipboard
		copyAddress(msg: string) {
			copy(msg);
			let self = this;
			self.copyState = '✓';

			setTimeout(function() {
				self.copyState = '';
			}, 3000);
		},
	},
};
</script>
