<template>
  <div id="container" class="restore-wallet">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="row split-left-nav">
                  <div class="col-4">
                    <span class="active">Enter 12-Word Phrase</span>
                  </div>
                  <div class="col-4">
                    <span>Set Passphrase</span>
                  </div>
                </div>
              </div>
              <div class="errorbar" v-if="errMsg != ''">{{errMsg}}</div>
              <div class="row no-gutters mt-5">
                <div class="split-left-main">
                  <h1 class="split-left-header">Restore Wallet</h1>
                  <p class="split-left-subheader">
                    A wallet can be restored from the 12-Word Phrase that
                    was issued when the wallet was initially created. Type
                    your 12-Word Phrase:
                  </p>
                </div>
                <div class="phrase-pane">
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[0]" placeholder="1">
                    <input type="text" v-on:keyup="validate" v-model="words[1]" placeholder="2">
                  </div>
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[2]" placeholder="3">
                    <input type="text" v-on:keyup="validate" v-model="words[3]" placeholder="4">
                  </div>
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[4]" placeholder="5">
                    <input type="text" v-on:keyup="validate" v-model="words[5]" placeholder="6">
                  </div>
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[6]" placeholder="7">
                    <input type="text" v-on:keyup="validate" v-model="words[7]" placeholder="8">
                  </div>
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[8]" placeholder="9">
                    <input type="text" v-on:keyup="validate" v-model="words[9]" placeholder="10">
                  </div>
                  <div class="row no-gutters">
                    <input type="text" v-on:keyup="validate" v-model="words[10]" placeholder="11">
                    <input type="text" v-on:keyup="validate" v-model="words[11]" placeholder="12">
                  </div>
                </div>
              </div>
              <div class="button-area">
                <div class="form-wrapper">
                  <div class="form-element">
                    <button
                      class="split-left-button"
                      type="button"
                      :disabled="!validated"
                      v-on:click="onNext"
                    >Continue</button>
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
import ChannelCodes from '../../../core/channel_codes';
import * as bip39 from 'bip39';
import SplashSlide from '../SplashSlide.vue';

export default {
	components: {
		SplashSlide,
	},
	data() {
		return {
			words: [],
			validated: false,
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
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onEvents hooks this component to events of interest.
		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},

		// Validate the currently inputed 12-words seed
		// phrases. This is called each time the user types.
		validate() {
			if (this.words.length < 12) {
				this.validated = false;
				return;
			}

			let nonEmptyIndices = 0;
			for (let i = 0; i < this.words.length; i++) {
				const word = this.words[i];
				if (!word || word.trim().length === 0) {
					nonEmptyIndices++;
				}
			}
			if (nonEmptyIndices > 0) {
				this.validated = false;
				return;
			}

			this.validated = true;
		},

		// onNext validates the provided and pre-validated
		// 12-word phrase and redirects to the passphrase
		// route where the user provides a passphrase to lock
		// their restored wallet
		onNext() {
			if (!bip39.validateMnemonic(this.words.join(' '))) {
				this.errMsg = 'Your 12-Word phrase is not valid';
				return;
			}

			const seed = Buffer.from(
				bip39.mnemonicToEntropy(this.words.join(' ')),
				'hex',
			);

			this.$router.push({
				name: 'set-passphrase',
				params: {
					entropy: new Uint8Array(seed),
				},
			});
		},
	},
};
</script>
