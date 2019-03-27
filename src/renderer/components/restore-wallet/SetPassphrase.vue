<template>
  <div id="container" class="index">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav two">
                  <span>Enter 12-Word Phrase</span>
                  <span class="active">Set Passphrase</span>
                </div>
              </div>
              <transition name="fade">
                <div class="errorbar mt-2" v-if="errMsg != ''">{{errMsg}}</div>
              </transition>
              <div class="row no-gutters">
                <div class="split-left-main">
                  <h1 class="split-left-header">Set Passphrase</h1>
                  <p class="split-left-subheader">
                    You need to provide a strong passphrase to protect your recovered wallet. Do not ever forget it, otherwise
                    you will not be able to unlock your wallet and since we don't store your passphrase
                    we won't be able to help.
                  </p>
                  <form action id="welcome-form" method novalidate>
                    <div class="form-wrapper">
                      <div class="form-element">
                        <label>
                          Enter a password
                          <span class="text-muted">(minimum of 6 characters)</span>
                        </label>
                        <input
                          type="password"
                          v-on:keyup="checkPasswordStrength"
                          v-model="passphrase"
                          placeholder="Enter a strong passphrase"
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
                        <button class="split-left-button" v-on:click="next" type="button">Continue</button>
                        <a
                          href="#"
                          v-on:click="$router.go(-1)"
                          class="btn btn-link text-muted ml-3 btn-back"
                        >Back</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="split-right index-bg">
            <div class="row no-gutters h100vh">
              <div class="col-12">
                <div class="about">
                  <h1>Ellcrys - A Blockchain for Collaboration</h1>
                  <h2>
                    The Ellcrys Network is a blockchain system that allows
                    you to create, co-own and co-manage open source software
                    products and organizations without fear of censorship.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChannelCodes from '../../../core/channel_codes';
import { ipcRenderer } from 'electron';
import * as crypto from 'crypto';
import { kdf } from '../../../utilities/crypto';
import { TopAlertOpen } from '../constants/events';
const zxcvbn = require('zxcvbn');

export default {
	props: {
		entropy: Uint8Array,
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
		this.onEvents();
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.WalletCreated, this.onWalletCreated);
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		// onWalletCreated is called when the wallet has been created.
		// We react to this event by emitting WalletFinalize to
		// instruct the main process to finalize the wallet.
		onWalletCreated(event, msg) {
			ipcRenderer.send(ChannelCodes.WalletFinalize);
		},

		// onWalletFinalized is called when the wallet has been
		// finalized. We react to the event by redirecting to the dashboard.
		// prettier-ignore
		onWalletFinalized(event, msg) {
			this.$router.push({ name: 'dashboard', query: { restorationDone: true }});
		},

		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onEvents hooks this component to events of interest.
		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.WalletCreated, this.onWalletCreated);
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.WalletFinalized, this.onWalletFinalized);
		},

		/**
		 * Generate a hardened version of the
		 * given passphrase.
		 * @param {string} passphrase The passphrase to harden
		 */
		generateKDFPass(passphrase: string): Buffer {
			return kdf(passphrase);
		},

		/**
		 * Returns the class that describe the passphrase
		 * current strength
		 * @param expectedStrength {number} the passphrase strength
		 */
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

		/**
		 * Check the strength of a passphrase.
		 */
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

		/**
		 * Start the wallet creation process when the
		 * next button is clicked
		 */
		next() {
			if (this.passphrase.trim() === '') {
				this.errMsg = 'Please enter a password';
				return;
			}

			if (this.passphrase.trim().length < 6) {
				this.errMsg = 'Too short. Must have a minimum of 6 letters';
				return;
			}

			if (!this.entropy || this.entropy.length == 0) {
				this.errMsg = 'AppError: Entropy not found';
				return;
			}

			this.errMsg = '';

			const kdfPass = this.generateKDFPass(this.passphrase);
			ipcRenderer.send(ChannelCodes.WalletNew, {
				entropy: this.entropy,
				kdfPass,
			});
		},
	},
};
</script>
