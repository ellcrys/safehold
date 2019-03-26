<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">


        <!-- Send From Wallet Comienza  -->

        <div class="" id="send-from-wallet">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>Send from Ellcrys Wallet</h1>
                    <button @click="closeSendModalTx()" class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <!-- Phase 1 -->



                    <div class="phase phase-1">

                        <div class="account-switcher" v-bind:class="{ 'expand' : dropDownMenu }" ref="input" @click="openDropDown()">

                            <div class="account-display">
								<div class="account">
                                    <img class="account--photo" :src="makeAvatar(mainAccount.address)">
                                    <div class="account--detail">
                                        <h3> {{ mainAccount.name }} </h3>
                                        <strong> {{ mainAccount.address }} </strong>
                                        <span><em>Bal:</em> {{ mainAccount.balance }} ELL</span>
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

                        <form action=""  id="send-from-wallet-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Amount</label>

                                    <div class="amount-input">
                                        <input type="text" placeholder="2,002" />
                                        <span>ELL</span>
                                    </div>

                                    <strong>Invalid Amount</strong>
                                </div>

                                <div class="form-element">
                                    <label>Recipient Address</label>
                                    <input type="text" placeholder="e2 . . ." />
                                    <strong>Invalid Address</strong>
                                </div>

                                <div class="form-element">
                                  <div class="slider-trigger-section">
                                    <label>Transaction Fee</label>
                                    <a class="form-tag" href="">Use Feed Slider</a>
                                  </div>
                                    <div class="amount-input">
                                        <input type="text" placeholder="0.03" />
                                        <span>ELL</span>
                                    </div>

                                    <div class="amount-slider hide">
                                        <button class="left"></button>
                                        <vueSlider v-model="value" :tooltip="'always'"></vueSlider>
                                        <button class="right"></button>

                                    </div>


                                    <strong>Invalid Amount</strong>
                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" @click="getRoute()" type="submit">Send</button>
                                </div>

                            </div>

                        </form>

                    </div>


					<!-- <div class="phase phase-1">
                        <div class="account-switcher expand">

                            <div class="account-display">
                                <div class="account">
                                    <img class="account--photo" src="../../assets/img/bitmap.png" />
                                    <div class="account--detail">
                                        <h3>Money Bag</h3>
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                        <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                    </div>
                                </div>
                            </div>

                            <div class="account-wrapper">

                                <div class="account">
                                    <img class="account--photo" src="../../assets/img/bitmap.png" />
                                    <div class="account--detail">
                                        <h3>Money Bag</h3>
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                        <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                    </div>
                                </div>


                                <div class="account active">
                                    <img class="account--photo" src="../../assets/img/bitmap.png" />
                                    <div class="account--detail">
                                        <h3>OpenXcampaigner</h3>
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                        <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                    </div>
                                </div>

                                <div class="account">
                                    <img class="account--photo" src="../../assets/img/bitmap.png" />
                                    <div class="account--detail">
                                        <h3>Money Bag</h3>
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                        <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                    </div>
                                </div>

                            </div>

						</div>
					</div> -->
                    <!-- Phase 1 -->



                    <!-- Phase 2 -->


                    <div class="phase phase-2">

                        <div id="send-receipt-amount-section">
                            <h1>10.00921 ELL</h1>
                            <span>Amount Transacted</span>
                        </div>


                        <div id="send-receipt-main-content">

                            <div class="txn-hash">
                                <span>Txn Hash:</span>
                                <div>
                                    <p>0xa09046714c3a3ebdd26a6d8dd5affa5d43272416845c388a9c6eccb4f0948102</p>
                                    <button>Copy</button>
                                </div>
                            </div>
                            <div class="account-switcher">

                                <label>Sender Address:</label>

                                <div class="account-wrapper">
                                    <div class="account target">
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                        <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                    </div>
                                </div>


                                <label>Recipient Address:</label>
                                <div class="account-wrapper">
                                    <div class="account">
                                        <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                    </div>
                                </div>


                            </div>


                            <div id="send-receipt-system-data">

                                <div class="section">
                                    <strong>0.00373 ell</strong>
                                    <span>Transaction fee</span>
                                </div>

                                <div class="section">
                                    <strong>2 seconds ago</strong>
                                    <span>Jan-14-2019 05:03:29 PM + UTC</span>
                                </div>

                            </div>


                            <div id="send-receipt-button-group">
                                <button>Decline</button>
                                <button>Confirm</button>
                            </div>


                        </div>



                    </div>

                    <!-- Phase 2 -->

                </div>

            </div>

        </div>

        <!-- Send From Wallet Extremos  -->



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
import { IAccountData } from '../../../../';

export default {
	components: {
		VueSlider,
	},
	mixins: [Mixin],
	data() {
		return {
			open: false,
			value: 20,
			refAddr: '',
			dropDownMenu: false,
			options: {
				dotSize: 40,
				width: 'auto',
				height: 10,
				min: 0,
				max: 2000,
			},
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

		this.$bus.$on(ModalSendOpen, data => {
			this.open = true;
			this.refAddr = data.address;
		});

		this.$bus.$on(ModalSendClose, () => {
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
				for (let i = 0; i < this.accounts.length; i++) {
					if (this.accounts[i].address === this.refAddr) {
						this.mainAccount = {
							name: this.accounts[i].name,
							address: this.accounts[i].address,
							balance: this.accounts[i].balance,
							hdPath: this.accounts[i].hdPath,
							isCoinbase: this.accounts[i].isCoinbase,
						};

						return false;
					}
				}
			}
		},

		getRoute() {
			console.log(' >>>>>> ', this.$route.name);
		},

		closeSendModalTx() {
			this.$bus.$emit(ModalSendClose);
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
	},
};
</script>
