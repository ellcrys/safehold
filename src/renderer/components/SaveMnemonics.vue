<template>
  <div id="container" class="save-mnemonics">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav">
                  <span>Welcome</span>
                  <span class="active">12-Word Seed</span>
                  <span>Verify Seed</span>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="split-left-main">
                  <h1 class="split-left-header">Save Your 12-Word Phrase</h1>
                  <p class="split-left-subheader">
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
                    <div class="row no-gutters mb-3">
                      <div class="pill">{{ seedWords[0] }}</div>
                      <div class="pill">{{ seedWords[1] }}</div>
                      <div class="pill">{{ seedWords[2] }}</div>
                    </div>
                    <div class="row no-gutters mb-3">
                      <div class="pill">{{ seedWords[3] }}</div>
                      <div class="pill">{{ seedWords[4] }}</div>
                      <div class="pill">{{ seedWords[5] }}</div>
                    </div>
                    <div class="row no-gutters mb-3">
                      <div class="pill">{{ seedWords[6] }}</div>
                      <div class="pill">{{ seedWords[7] }}</div>
                      <div class="pill">{{ seedWords[8] }}</div>
                    </div>
                    <div class="row no-gutters">
                      <div class="pill">{{ seedWords[9] }}</div>
                      <div class="pill">{{ seedWords[10] }}</div>
                      <div class="pill">{{ seedWords[11] }}</div>
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
                        href="#"
                        v-on:click="$router.go(-1)"
                        class="btn btn-link text-muted ml-3 btn-back"
                      >Back</a>
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
import * as bip39 from 'bip39';
import { ModalConfirmCopyOpen } from './constants/events';

export default {
	data() {
		return {
			seedWords: [],
		};
	},

	created() {
		this.onEvents();
		ipcRenderer.send(ChannelCodes.GetWalletEntropy);
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(
			ChannelCodes.DataWalletEntropy,
			this.onDataWalletEntropy,
		);
	},

	methods: {
		onAppErr(event, err) {
			console.error('Err', err);
		},

		onDataWalletEntropy(event, seed) {
			this.seedWords = bip39.entropyToMnemonic(seed).split(' ');
		},

		/**
		 * Listen for incoming IPC events
		 */
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(
				ChannelCodes.DataWalletEntropy,
				this.onDataWalletEntropy,
			);
		},

		onCopy() {
			const seedWords = this.seedWords.join(' ');
			this.$bus.$emit(ModalConfirmCopyOpen, seedWords);
		},

		onNext() {
			this.$router.push('verify-seed-words');
		},
	},
};
</script>
