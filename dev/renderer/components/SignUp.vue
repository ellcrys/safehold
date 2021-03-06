<template>
  <div id="container" class="index">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="row split-left-nav">
                  <div class="col-4">
                    <span class="active">Welcome</span>
                  </div>
                  <div class="col-4">
                    <span>12-Word Seed</span>
                  </div>
                  <div class="col-4">
                    <span>Verify Seed</span>
                  </div>
                </div>
              </div>
              <div class="errorbar" v-if="errMsg != ''">{{errMsg}}</div>
              <div class="row no-gutters">
                <div class="split-left-main">
                  <img class="logo" src="../assets/img/logo-large-white.svg">
                  <h1 class="split-left-header">Hi, Create Your Wallet</h1>
                  <p class="split-left-subheader">
                    <b>It is time to create a wallet.</b> First, you will need to provide a
                    strong passphrase to protect your new wallet. Do not ever forget it, otherwise
                    you will not be able to unlock your wallet and since we don't store your passphrase
                    we won't be able to help.
                  </p>
                  <form action id="welcome-form" v-on:submit.prevent method novalidate>
                    <div class="form-wrapper">
                      <div class="form-element">
                        <label>
                          Enter a passphrase
                          <span class="text-muted">(minimum of 6 characters)</span>
                        </label>
                        <input
                          type="password"
                          v-model="passphrase"
                          v-on:keyup="checkPasswordStrength"
                          v-on:keyup.prevent.13="next"
                          placeholder="Enter a strong passphrase"
                          autofocus
                        >
                        <ul id="password-strength-bar-list">
                          <li v-bind:class="passStrengthClass(0)"></li>
                          <li v-bind:class="passStrengthClass(0)"></li>
                          <li v-bind:class="passStrengthClass(1)"></li>
                          <li v-bind:class="passStrengthClass(1)"></li>
                          <li v-bind:class="passStrengthClass(2)"></li>
                          <li v-bind:class="passStrengthClass(2)"></li>
                          <li v-bind:class="passStrengthClass(3)"></li>
                          <li v-bind:class="passStrengthClass(3)"></li>
                          <li v-bind:class="passStrengthClass(4)"></li>
                          <li v-bind:class="passStrengthClass(4)"></li>
                        </ul>
                      </div>
                      <div class="form-element mt-2">
                        <button class="split-left-button" v-on:click="next" type="button">Next</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="options">
                <div class="row">
                  <div class="col-4">
                    <div class="item" v-on:click="$router.push('restore-wallet')">
                      <div class="icon">
                        <img src="../assets/img/restore.svg" alt="Restore" title="Restore">
                      </div>
                      <span>Restore</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="item" @click="openURI('https://www.ellcrys.org/faq')">
                      <div class="icon">
                        <img src="../assets/img/question.svg" alt="Help" title="Help">
                      </div>
                      <span>Help</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="item" v-on:click="onAppQuit">
                      <div class="icon">
                        <img src="../assets/img/power.svg" alt="Power" title="Power">
                      </div>
                      <span>Quit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="split-right index-bg">
            <SplashSlide/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChannelCodes from '../../core/channel_codes';
import { ipcRenderer, remote } from 'electron';
import * as crypto from 'crypto';
import { kdf } from '../../utilities/crypto';
const zxcvbn = require('zxcvbn');
import Mixin from './dashboard/Mixin';
import SplashSlide from './SplashSlide.vue';

export default {
	mixins: [Mixin],
	components: {
		SplashSlide,
	},
	data() {
		return {
			passphrase: '',
			errMsg: '',
			passStrength: '',
			passStrengthScore: -1,
		};
	},

	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
	},

	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppLaunched,this.onAppLaunched,);
		ipcRenderer.removeListener(ChannelCodes.WalletCreated,this.onWalletCreated);
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppQuit() {
			ipcRenderer.send(ChannelCodes.AppQuit);
		},

		// onAppLaunched is called when the application
		// had just been launched. We respond by navigating
		// to the index page.
		// prettier-ignore
		onAppLaunched(event, msg) {
			if (msg.hasWallet) { return this.$router.push('login') }
		},

		// onWalletCreated is called when the wallet has
		// been created on the main process.
		onWalletCreated(event, msg) {
			return this.$router.push('save-seed-words');
		},

		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onEvents hooks this component to events of interest
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppLaunched, this.onAppLaunched);
			ipcRenderer.on(ChannelCodes.WalletCreated, this.onWalletCreated);
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},

		/**
		 * Generate a hardened version of the
		 * given passphrase.
		 * @param {string} passphrase The passphrase to harden
		 */
		generateKDFPass(passphrase: string): Buffer {
			return kdf(passphrase);
		},

		// passStrengthClass helps determine the password
		// strength class given the current passphrase strength
		passStrengthClass(expectedStrength: number) {
			var result = {};
			if (expectedStrength === this.passStrengthScore) {
				result[this.passStrength] = true;
			} else {
				if (this.passStrengthScore - expectedStrength >= 1) {
					result[this.passStrength] = true;
				}
			}
			return result;
		},

		// checkPasswordStrength checks and sets the
		// current passphrase strength
		checkPasswordStrength() {
			if (this.passphrase === '') {
				this.passStrength = '';
				this.passStrengthScore = -1;
				return;
			}

			this.passStrengthScore = zxcvbn(this.passphrase).score;
			switch (this.passStrengthScore) {
				case 0:
					this.passStrength = 'very-bad';
					break;
				case 1:
					this.passStrength = 'bad';
					break;
				case 2:
					this.passStrength = 'fair';
					break;
				case 3:
					this.passStrength = 'good';
					break;
				case 4:
					this.passStrength = 'very-good';
					break;
			}
		},

		// next starts the wallet creation process
		// when the next button is clicked
		next() {
			if (this.passphrase.trim() === '') {
				this.errMsg = 'Please enter a password';
				return;
			}

			if (this.passphrase.trim().length < 6) {
				this.errMsg = 'Too short. Must have a minimum of 6 letters';
				return;
			}

			this.errMsg = '';

			const kdfPass = this.generateKDFPass(this.passphrase);
			ipcRenderer.send(ChannelCodes.WalletNew, {
				entropy: crypto.randomBytes(16),
				kdfPass,
			});
		},
	},
};
</script>
