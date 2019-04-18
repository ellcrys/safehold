<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane h10pct">
        <div class id="new-account-wrapper">
          <div class="overlay-content">
            <div class="overlay-header">
              <h1>New Account</h1>
              <button @click="closeAccountModal()" class="overlay-close"></button>
            </div>

            <div class="overlay-main">
              <div class="phase" v-if="accountStatus === false">
                <h1 class="overlay-heading">Create New Account</h1>
                <span class="overlay-subheading">You can set up a new account easily</span>

                <form action id method novalidate>
                  <div class="form-wrapper">
                    <div class="form-element">
                      <label>Enter Account Name</label>
                      <span class="accountError" v-if="nameError !== ''">{{ nameError }}</span>
                      <input v-model="txtInput" type="text" placeholder="John Doe">
                      <strong>Invalid password</strong>
                    </div>

                    <div class="form-element">
                      <button
                        @click="createAccount()"
                        class="split-left-button"
                        type="submit"
                      >Create</button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="phase" v-if="accountStatus === true">
                <img class="overlay-large-image" src="../../assets/img/account-created.svg">

                <h2 class="overlay-heading-2">New account created!</h2>

                <form action id="view-account-form" method novalidate>
                  <div class="form-wrapper">
                    <div class="account-address">
                      <img :src="qrImage">
                      <div>
                        <h3>Account address</h3>
                        <span>{{ createdAddr }}</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import { ModalNewAccountOpen, ModalNewAccountClose } from '../constants/events';
import ChannelCodes from '../../../core/channel_codes';
import { ipcRenderer } from 'electron';
import { IAccountData } from '../../../../';

import * as _ from 'lodash';
import Mixin from '../dashboard/Mixin';

const QRCode = require('qrcode');

export default {
	mixins: [Mixin],
	data() {
		return {
			open: false,
			txtInput: '',
			nameError: '',
			accountStatus: false,
			accounts: [],
			createdAddr: '',
			qrImage: '',
		};
	},

	// created hook
	// - listen to event that open the modal
	// - listen to events that close the modal
	// - register other events
	created() {
		this.onEvents();

		this.$bus.$on(ModalNewAccountOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalNewAccountClose, () => {
			this.open = false;
		});
	},
	methods: {
		// created is a lifecycle method of vue.
		// It reacts by:
		// - listening for events of interest
		onEvents() {
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onWalletGetAccount);

			ipcRenderer.on(
				ChannelCodes.AccountRedirect,
				this.onNewAccountCreate,
			);
		},

		// onWalletGetAccount get the total number of all accounts
		// in the wallet and set a default name for an account which
		// can be used or change as the account name to be created
		onWalletGetAccount(e, accounts: IAccountData[]) {
			// Do not update account name
			// when the modal is open
			if (this.open) {
				return false;
			}
			this.accounts = accounts;
			this.txtInput = 'Account ' + (accounts.length + 1);
		},

		// onNewAccountCreate event is called after the successful
		// creation of a new account to generate a QR image equivalent
		// of the address
		onNewAccountCreate(e, account: IAccountData) {
			this.createdAddr = account;

			const opts = {
				color: {
					dark: '#0663FF', // Blue dots
					light: '#0000', // Transparent background
				},
			};

			// Generate QrCode for selected account
			QRCode.toDataURL(account, opts)
				.then(url => {
					this.qrImage = url;
				})
				.catch(err => {
					console.error(err);
				});
		},

		// closeAccountModal closed the NewAccount Modal
		closeAccountModal() {
			this.open = false;
			this.accountStatus = false;
		},

		// createAccount  create the account after specifying a name
		// validation is required before the creation of the account
		createAccount() {
			this.nameError = '';

			// validate empty name
			if (this.txtInput === '') {
				this.nameError = 'Account name is required to continue.';
				return false;
			}

			// validate name against existing account names
			for (let i = 0; i < this.accounts.length; i++) {
				if (this.accounts[i].name.trim() == this.txtInput.trim()) {
					this.nameError = 'Account with same name already exist';
					return false;
				}
			}

			const accountName = this.txtInput;

			// send the the account name as parameter
			// along with AccountCreate channel code
			ipcRenderer.send(ChannelCodes.AccountCreate, accountName);

			this.accountStatus = true;
		},
	},
};
</script>
