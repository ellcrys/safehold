<template>
  <div id="container" class="index">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav">
                  <span class="active" href="#">Welcome</span>
                  <span href>12-Words Seed</span>
                  <span href>Verify Seed</span>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="split-left-main">
                  <img class="logo" src="../assets/img/logo-large-white.svg">
                  <h1 class="split-left-header">Hello, Welcome To Ellcrys</h1>
                  <p class="split-left-subheader">
                    <b>It is time to create a wallet.</b> First, you will need to provide a
                    strong passphrase to protect your new wallet. Do not ever forget it, otherwise
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
                        <em>{{ textErr }}</em>
                      </div>

                      <div class="form-element">
                        <button class="split-left-button" v-on:click="next" type="button">Next</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="options">
                <div class="row">
                  <div class="col-4">
                    <div class="item">
                      <div class="icon">
                        <img src="../assets/img/restore.svg" alt="Restore" title="Restore">
                      </div>
                      <span>Restore</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="item">
                      <div class="icon">
                        <img src="../assets/img/question.svg" alt="Help" title="Help">
                      </div>
                      <span>Help</span>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="item">
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
              <div class="col-12 align-self-end">
                <div class="footer clearfix">
                  <div class="version float-left">v0.0.1</div>
                  <div class="photo-credit float-right">
                    Photo by
                    <a href="#">Shea Rouda</a>
                  </div>
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
import ChannelCodes from '../../core/channel_codes';
import { ipcRenderer } from 'electron';
import * as crypto from 'crypto';
import { kdf } from '../../utilities/crypto';
const zxcvbn = require('zxcvbn');

export default {
	data() {
		return {
			passphrase: '',
			textErr: '',
			passStrength: '',
			passStrengthScore: -1,
		};
	},

	created() {
		this.onEvents();
	},

	beforeDestroy() {
		ipcRenderer.removeListener(
			ChannelCodes.AppLaunched,
			this.onAppLaunched,
		);
		ipcRenderer.removeListener(
			ChannelCodes.WalletCreated,
			this.onWalletCreated,
		);
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppLaunched(event, msg) {
			if (msg.hasWallet) {
				return this.$router.push('login');
			}
		},

		onWalletCreated(event, msg) {
			return this.$router.push('save-seed-words');
		},

		onAppErr(event, err) {
			console.error('Err', err);
		},

		/**
		 * Listen for incoming IPC events
		 */
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
				this.textErr = 'Please enter a password';
				return;
			}

			if (this.passphrase.trim().length < 6) {
				this.textErr = 'Too short. Must have a minimum of 6 letters';
				return;
			}

			this.textErr = '';

			const kdfPass = this.generateKDFPass(this.passphrase);
			ipcRenderer.send(ChannelCodes.WalletNew, {
				seed: crypto.randomBytes(16),
				kdfPass,
			});
		},
	},
};
</script>
