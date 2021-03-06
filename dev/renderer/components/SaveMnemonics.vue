<template>
  <div id="container" class="save-mnemonics">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="row split-left-nav">
                  <div class="col-4">
                    <span>Welcome</span>
                  </div>
                  <div class="col-4">
                    <span class="active">12-Word Seed</span>
                  </div>
                  <div class="col-4">
                    <span>Verify Seed</span>
                  </div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="split-left-main mt-5">
                  <h1 class="split-left-header">Save Your 12-Word Phrase</h1>
                  <p class="split-left-subheader smaller-text">
                    We have created your unique 12-Word seed. This seed is the
                    master key of your wallet. If your forget your passphrase or your wallet
                    is destroyed, it can be used to recreate your wallet
                    at any time. To avoid permanent loss of your wallet, write down your seed
                    and keep in a secret, offline location known to only you before continuing.
                    <br>
                    <br>On the next prompt, you will be required to identify your seed to
                    confirm that it has been saved.
                    <br>
                    <br>
                    <span class="text-danger">
                      <i>Warning</i>:
                    </span> Anyone who gets hold of your 12-Word phrase can access the funds in your wallet. Do
                    not reveal to anyone.
                  </p>

                  <div id="seed-phrase-pills">
                    <div class="row">
                      <div class="col-4">
                        <div class="pill">{{ seedWords[0] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[1] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[2] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div class="pill">{{ seedWords[3] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[4] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[5] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div class="pill">{{ seedWords[6] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[7] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[8] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div class="pill">{{ seedWords[9] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[10] }}</div>
                      </div>
                      <div class="col-4">
                        <div class="pill">{{ seedWords[11] }}</div>
                      </div>
                    </div>
                    <div class="copy">
                      <span
                        class="d-block text-center"
                        v-on:click="onCopy"
                      >Copy seed words to clipboard</span>
                    </div>
                  </div>

                  <div class="form-wrapper">
                    <div class="form-element">
                      <button class="split-left-button" type="button" v-on:click="onNext">Next</button>
                      <a
                        v-on:click.prevent="$router.go(-1)"
                        class="btn btn-link text-muted ml-3 btn-back"
                      >Back</a>
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
import * as bip39 from 'bip39';
import { ModalConfirmCopyOpen } from './constants/events';
import Mixin from './dashboard/Mixin';
import SplashSlide from './SplashSlide.vue';

export default {
	mixins: [Mixin],
	components: {
		SplashSlide,
	},
	data() {
		return {
			seedWords: [],
		};
	},

	// created is a lifecycle method of vue. We react
	// to this event by emitting a WalletGetEntropy
	// event to fetch the entropy used to derive the
	// seed phrase. We also hook listeners to various
	// events from here.
	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
		ipcRenderer.send(ChannelCodes.WalletGetEntropy);
	},

	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataWalletEntropy, this.onDataWalletEntropy);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onDataWalletEntropy is called when DataWalletEntropy event
		// is received. We react to this event by converting the
		// returned seed into a list of mnenonic words and set it
		// on the component.
		onDataWalletEntropy(event, seed) {
			this.seedWords = bip39.entropyToMnemonic(seed).split(' ');
		},

		// onEvents hooks this component to events of interest.
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(
				ChannelCodes.DataWalletEntropy,
				this.onDataWalletEntropy,
			);
		},

		// onCopy opens up a modal for confirming whether to
		// copy the seed words into the clipboard.
		onCopy() {
			const seedWords = this.seedWords.join(' ');
			this.$bus.$emit(ModalConfirmCopyOpen, seedWords);
		},

		// onNext is called when the `next` button is triggered.
		// It cause the router to redirect to the seed verification
		// page.
		onNext() {
			this.$router.push('verify-seed-words');
		},
	},
};
</script>
