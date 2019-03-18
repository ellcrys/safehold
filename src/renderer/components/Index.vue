<template>
  <div id="container" class="index" v-if="show">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav">
                  <span class="active">Welcome</span>
                  <span>12-Word Seed</span>
                  <span>Verify Seed</span>
                </div>
              </div>
              <div class="errorbar mt-2" v-if="errMsg != ''">{{errMsg}}</div>
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
                    <div class="item" v-on:click="$router.push('restore-wallet')">
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
import { ipcRenderer, remote } from 'electron';
import * as crypto from 'crypto';
import { kdf } from '../../utilities/crypto';
const zxcvbn = require('zxcvbn');

export default {
	data() {
		return {
			passphrase: '',
			errMsg: '',
			passStrength: '',
			passStrengthScore: -1,
			show: false,
		};
	},

	created() {
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
			this.show = true;
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
