<template>
  <div id="container" class="login">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="errorbar" v-if="errMsg != ''">{{errMsg}}</div>
            <div class="split-center-content">
              <div class="row no-gutters">
                <div class="split-left-main">
                  <img src="../assets/img/logo-large-white.svg" class="logo">
                  <h1 class="split-left-header">Hello, Welcome Back</h1>
                  <p class="split-left-subheader">
                    Enter your wallet passphrase to unlock your wallet. If you do not
                    remember your passphrase, but you know your 12-Word phrase, click the "Restore" button
                    to recover your wallet.
                  </p>
                  <form action id="welcome-form" method novalidate>
                    <div class="form-wrapper">
                      <div class="form-element">
                        <label>Enter a password</label>
                        <input
                          type="password"
                          v-model="passphrase"
                          v-on:keyup="errMsg=''"
                          placeholder="Type your passphrase"
                        >
                      </div>

                      <div class="form-element button mt-3">
                        <button class="split-left-button" v-on:click="openWallet" type="button">Open</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="options options-login">
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
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../core/channel_codes';
import { kdf } from '../../utilities/crypto';

export default {
	data() {
		return {
			passphrase: '',
			errMsg: '',
		};
	},

	created() {
		this.onEvents();
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppQuit() {
			ipcRenderer.send(ChannelCodes.AppQuit);
		},

		onAppErr(event, err) {
			if (err.code === 'failed_to_load_wallet') {
				this.errMsg = 'The passphrase your entered is incorrect';
				return;
			}
		},

		onWalletLoaded(event) {
			return this.$router.push('dashboard');
		},

		/**
		 * Listen for incoming IPC events
		 */
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.WalletLoaded, this.onWalletLoaded);
		},

		openWallet() {
			if (this.passphrase.trim() === '') {
				this.errMsg = 'Please enter your passphrase';
				return;
			}

			// Harden the passphrase by passing it through a KDF
			const kdfPass = kdf(this.passphrase);

			ipcRenderer.send(ChannelCodes.WalletLoad, kdfPass);
		},
	},
};
</script>
