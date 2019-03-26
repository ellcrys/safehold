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

				<div class="account-switcher" v-bind:class="{ 'expand' : dropDownMenu }" ref="input" @click="openDropDown()">

					<div class="account-display">
						<div class="account">
							<img class="account--photo" :src="makeAvatar(mainAccount.address)">
							<div class="account--detail">
								<h3> {{ mainAccount.name }} </h3>
								<!-- <strong> {{ mainAccount.address }} </strong> -->
								<!-- <span><em>Bal:</em> {{ mainAccount.balance }} ELL</span> -->
							</div>
						</div>
					</div>

					<div class="account-wrapper" v-if="accounts.length > 1 && refAddr === ''">
						<div class="account" @click="selectedAccount(accountKey)"  v-for="(account, accountKey) in accounts" v-bind:key="accountKey">
							<img class="account--photo" :src="makeAvatar(account.address)" />
							<div class="account--detail">
								<h3> {{ account.name }} </h3>
								<strong> {{ account.address }} </strong>
								<span><em>Bal:</em> {{ account.balance }} ELL</span>
							</div>
						</div>
					</div>

				</div>

			 	<div id="receive-to-wallet-qr-wrapper">
                	<img src="../../assets/img/wallet-qr-code.svg">

                	<div id="receive-to-wallet-account-section">
                  	<span> {{ mainAccount.address }} </span>
                  	<button>Copy</button>
                </div>

                <a href @click.prevent="openAddress(mainAccount.address)">View on Ellscan</a>
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
import { IAccountData } from '../../../../';
const open = require('open');

export default {
	data() {
		return {
			open: false,
			value: 20,
			refAddr: '',
			dropDownMenu: false,
			mainAccount: {
				name: '',
				hdPath: '',
				balance: '',
				address: '',
				isCoinbase: '',
			},
			accounts: [],
		};
	},
	mixins: [Mixin],
	watch: {
		accounts: function() {
			if (this.refAddr == '') {
				this.mainAccount = {
					name: this.accounts[0].name,
					hdPath: this.accounts[0].hdPath,
					balance: this.accounts[0].balance,
					address: this.accounts[0].address,
					isCoinbase: this.accounts[0].isCoinbase,
				};
			}
		},
	},
	created() {
		this.onEvents();

		this.$bus.$on(ModalReceiveOpen, data => {
			this.open = true;
			this.refAddr = data.address;
		});

		this.$bus.$on(ModalReceiveClose, () => {
			this.open = false;
		});

		ipcRenderer.send(ChannelCodes.DataAccounts);
	},
	methods: {
		onEvents() {
			ipcRenderer.on(ChannelCodes.DataAccounts, this.onWalletGetAccount);
		},

		onWalletGetAccount(e, accounts: IAccountData[]) {
			this.accounts = accounts;

			if (this.refAddr !== '') {
				_.map(accounts, v => {
					if (v.address === this.refAddr) {
						this.mainAccount = {
							name: v.name,
							address: v.address,
							balance: v.balance,
							hdPath: v.hdPath,
							isCoinbase: v.isCoinbase,
						};
					}
					return v;
				});
			}
		},

		getRoute() {
			console.log(' >>>>>> ', this.$route.name);
		},

		openDropDown() {
			this.dropDownMenu = !this.dropDownMenu;
		},

		selectedAccount(key) {
			this.mainAccount = {
				name: this.accounts[key].name,
				address: this.accounts[key].address,
				balance: this.accounts[key].balance,
				hdPath: this.accounts[key].hdPath,
				isCoinbase: this.accounts[key].isCoinbase,
			};
		},

		closeReceiveAddress() {
			this.$bus.$emit(ModalReceiveClose);
		},

		openAddress(addr) {
			open('https://ellscan.com/search?q=' + addr);
		},
	},
};
</script>
