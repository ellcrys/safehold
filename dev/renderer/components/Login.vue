<template>
  <div id="container" class="login">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="errorbar" v-if="errMsg != ''">{{errMsg}}</div>
            <div class="split-center-content">
              <div class="row no-gutters">
                <div class="split-left-main mt-5">
                  <img src="../assets/img/logo-large-white.svg" class="logo">
                  <h1 class="split-left-header">Hello, Welcome Back</h1>
                  <p class="split-left-subheader">
                    Enter your wallet passphrase to unlock your wallet. If you do not
                    remember your passphrase, but you know your 12-Word phrase, click the "Restore" button
                    to recover your wallet.
                  </p>
                  <form action v-on:submit.prevent id="welcome-form" method novalidate>
                    <div class="form-wrapper">
                      <div class="form-element">
                        <label>Enter a passphrase</label>
                        <input
                          type="password"
                          v-model="passphrase"
                          v-on:keyup.prevent.stop.13="openWallet"
                          placeholder="Type your passphrase"
                          autofocus
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
                    <div class="item" v-on:click="goToRestore">
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
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../core/channel_codes';
import { kdf } from '../../utilities/crypto';
import SplashSlide from './SplashSlide.vue';
import Mixin from './dashboard/Mixin';
import {
	ModalWalletOverrideWarningOpen,
	ModalLoaderOpen,
	ModalLoaderClose,
} from './constants/events';

export default {
	mixins: [Mixin],
	components: {
		SplashSlide,
	},
	data() {
		return {
			passphrase: '',
			errMsg: '',
		};
	},

	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		// onAppQuit is called when the quit button is triggered
		onAppQuit() {
			ipcRenderer.send(ChannelCodes.AppQuit);
		},

		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			this.$bus.$emit(ModalLoaderClose);
			if (err.code === 'failed_to_load_wallet') {
				this.errMsg = 'The passphrase your entered is incorrect';
				return;
			}
		},

		// onWalletLoaded is called when the wallet has been
		// decrypted and loaded on the main process. We react
		// to this by redirecting to the dashboard.
		onWalletLoaded(event) {
			return this.$router.push('dashboard');
		},

		// onEvents hooks this component to events of interest
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.WalletLoaded, this.onWalletLoaded);
		},

		// openWallet is called when the `Open` button is triggered.
		// We react by validating the passphrase, hardening it and
		// firing a WalletLoad event with the passphrase as a parameter.
		// The main process will receive the event and use the passphrase
		// to unlock the wallet and emit a WalletLoaded event.
		openWallet() {
			this.errMsg = '';

			if (this.passphrase.trim() === '') {
				this.errMsg = 'Please enter your passphrase';
				return;
			}

			// Harden the passphrase by passing it through a KDF
			const kdfPass = kdf(this.passphrase);

			this.$bus.$emit(ModalLoaderOpen);
			ipcRenderer.send(ChannelCodes.WalletLoad, kdfPass);
		},

		// goToRestore redirects to the wallet restoration page
		// after confirmation is requested and received.
		// prettier-ignore
		goToRestore() {
			this.$bus.$emit(ModalWalletOverrideWarningOpen, () => {
				return this.$router.push('restore-wallet');
			});
		}
	},
};
</script>
