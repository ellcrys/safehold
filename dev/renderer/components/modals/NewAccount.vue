<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">


                  <!-- New Account Comienza  -->

        <div class="" id="new-account-wrapper">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>New Account</h1>
                    <button @click="closeAccountModal()" class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <!-- Phase 1 -->
                    <div class="phase" v-if="accountStatus === false">

                        <h1 class="overlay-heading">Create New Account</h1>
                        <span class="overlay-subheading">You can set up a new account easily</span>

                        <form action="" id="" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Enter Account Name</label> <span class="accountError" v-if="nameError !== ''"> {{ nameError }}</span>
                                    <input v-model="txtInput" type="text" placeholder="John Doe" />
                                    <strong>Invalid password</strong>
                                </div>

                                <div class="form-element">
                                    <button @click="createAccount()" class="split-left-button" type="submit">Create</button>
								</div>

                            </div>

                        </form>

                    </div>
                    <!-- Phase 1 -->

                    <!-- Phase 2 -->
<!--
                    <div class="phase phase-2">

                        <h1 class="overlay-heading">Treat your private key with care</h1>
                        <span class="overlay-subheading">You can set up a new account by inputing a password</span>

                        <form action="" id="copy-private-key-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Your 94-character private key</label>
                                    <textarea disabled>wKSAjVeUSRZZA3esRirDUzvA4vjV761bsMQY4rWL8gcbUgB1vXGiBS32dtLtoNY2djZ7Ugzvax8YYPVUCz5qRxGFt6GHz8</textarea>
                                    <strong>Invalid private key</strong>
                                </div>

                                <div class="account-address">
                                    <img src="../../assets/img/account-qr-code.png" />
                                    <div>
                                        <h3>Account address</h3>
                                        <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Complete - Step 2 of 2</button>
                                </div>

                            </div>

                        </form>

                    </div> -->

                    <!-- Phase 2 -->

                    <!-- Phase 3 -->

                    <div class="phase " v-if="accountStatus === true">

                        <img class="overlay-large-image" src="../../assets/img/account-created.svg" />

                        <h2 class="overlay-heading-2">New account created!</h2>

                        <form action="" id="view-account-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="account-address">
                                    <!-- <img src="../../assets/img/account-qr-code.png" /> -->
									<img :src=qrImage>
                                    <div>
                                        <h3>Account address</h3>
                                        <span>{{ createdAddr }} </span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <button @click="closeAccountModal()" class="split-left-button" type="submit">continue</button>
                                </div>

                            </div>

                        </form>

                    </div>

                    <!-- Phase 3 -->

                </div>

            </div>

        </div>

        <!-- New Account Extremos  -->
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalNewAccountOpen,
	ModalNewAccountClose,
	ModalOnBoardingOpen,
} from '../constants/events';
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
		onEvents() {
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onWalletGetAccount);

			ipcRenderer.on(
				ChannelCodes.AccountRedirect,
				this.onNewAccountCreate,
			);
		},

		onWalletGetAccount(e, accounts: IAccountData[]) {
			this.accounts = accounts;
			this.txtInput = 'Account ' + (accounts.length + 1);
		},

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
		closeAccountModal() {
			this.$bus.$emit(ModalNewAccountClose);
			this.accountStatus = false;

			// Show the OnBoarding modal
			// if you are creating an account for the first time
			if (this.accounts.length == 2) {
				this.$bus.$emit(ModalOnBoardingOpen);
			}
		},

		createAccount() {
			this.nameError = '';

			if (this.txtInput === '') {
				this.nameError = 'Account name is required to continue.';
				return false;
			}

			for (let i = 0; i < this.accounts.length; i++) {
				if (this.accounts[i].name.trim() == this.txtInput.trim()) {
					this.nameError = 'Account with same name already exist';
					return false;
				}
			}

			const accountName = this.txtInput;

			ipcRenderer.send(ChannelCodes.AccountCreate, accountName);

			this.accountStatus = true;
		},
	},
};
</script>
