<template>
  <div id="container" class="verify-seed" v-bind:class="{ 'd-none': hideAll }">
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
                    <span>12-Word Seed</span>
                  </div>
                  <div class="col-4">
                    <span class="active">Verify Seed</span>
                  </div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="split-left-main mt-5">
                  <h1 class="split-left-header">Verify Your Seed</h1>
                  <p class="split-left-subheader">
                    To verify that you have written down your seed, kindly select
                    <span>four</span> correct words that are part of your 12-Word seed
                    phrase.
                  </p>

                  <div id="verify-seedphrase-instruction" class="d-nones">
                    <p>
                      Select
                      <span>{{ 4 - correctIndices.length }} correct words</span> in
                      <span>{{ attempts }} attempts</span>
                      to complete this step.
                    </p>
                    <button class="close"></button>
                  </div>

                  <div id="verify-seedphrase-list">
                    <div class="row">
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(0), wrong: currentErrorIndex == 0 }"
                          v-on:click="wordSelected(0)"
                        >{{ this.challengeWords[0] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(1), wrong: currentErrorIndex == 1 }"
                          v-on:click="wordSelected(1)"
                        >{{ this.challengeWords[1] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(2), wrong: currentErrorIndex == 2 }"
                          v-on:click="wordSelected(2)"
                        >{{ this.challengeWords[2] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(3), wrong: currentErrorIndex == 3 }"
                          v-on:click="wordSelected(3)"
                        >{{ this.challengeWords[3] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(4), wrong: currentErrorIndex == 4 }"
                          v-on:click="wordSelected(4)"
                        >{{ this.challengeWords[4] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(5), wrong: currentErrorIndex == 5 }"
                          v-on:click="wordSelected(5)"
                        >{{ this.challengeWords[5] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(6), wrong: currentErrorIndex == 6 }"
                          v-on:click="wordSelected(6)"
                        >{{ this.challengeWords[6] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(7), wrong: currentErrorIndex == 7 }"
                          v-on:click="wordSelected(7)"
                        >{{ this.challengeWords[7] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(8), wrong: currentErrorIndex == 8 }"
                          v-on:click="wordSelected(8)"
                        >{{ this.challengeWords[8] }}</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(9), wrong: currentErrorIndex == 9 }"
                          v-on:click="wordSelected(9)"
                        >{{ this.challengeWords[9] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(10), wrong: currentErrorIndex == 10 }"
                          v-on:click="wordSelected(10)"
                        >{{ this.challengeWords[10] }}</div>
                      </div>
                      <div class="col-4">
                        <div
                          class="phrase"
                          v-bind:class="{ active: isValidWord(11), wrong: currentErrorIndex == 11 }"
                          v-on:click="wordSelected(11)"
                        >{{ this.challengeWords[11] }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="form-wrapper">
                    <div class="form-element">
                      <button
                        class="split-left-button"
                        type="button"
                        v-on:click="onNext"
                        :disabled="correctIndices.length < 4"
                      >Next</button>
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
const randomWords = require('./data/random-words.json');
import * as _ from 'lodash';
import log from 'electron-log';
import { ModalLoaderOpen } from './constants/events';
import Mixin from './dashboard/Mixin';
import SplashSlide from './SplashSlide.vue';
const MaxAttempts = 4;

export default {
	components: {
		SplashSlide,
	},
	mixins: [Mixin],
	data() {
		return {
			hideAll: false,
			seedWords: [],
			challengeWords: [],
			currentErrorIndex: -1,
			correctIndices: [],
			attempts: MaxAttempts,
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
		ipcRenderer.removeListener(ChannelCodes.DataWalletEntropy,this.onDataWalletEntropy);
		ipcRenderer.removeListener(ChannelCodes.WalletFinalized,this.onWalletFinalized);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {
			console.error('Err', err);
		},

		// onDataWalletEntropy is called when DataWalletEntropy event
		// is received. We react to this event by converting the
		// returned seed into a list of mnenonic words and constructing
		// the verification challenge data where we pick 4 random seed
		// words and mix with 8 other random words. The resulting 12
		// words will be used in the challenge.
		onDataWalletEntropy(event, seed) {
			this.seedWords = bip39.entropyToMnemonic(seed).split(' ');

			// Shuffle the seed words and add the first
			// for words to the challenge words list
			const shuffledSeedWords = _.shuffle(this.seedWords);
			this.challengeWords.push(shuffledSeedWords[0]);
			this.challengeWords.push(shuffledSeedWords[1]);
			this.challengeWords.push(shuffledSeedWords[2]);
			this.challengeWords.push(shuffledSeedWords[3]);

			// Shuffle the random words list and add
			// the first6 words to the challenge words list
			let shuffled = _.shuffle(randomWords.words);
			for (let i = 0; i < 8; i++) {
				this.challengeWords.push(shuffled[i].toLowerCase());
			}

			// Finally, shuffle the challenge words
			this.challengeWords = _.shuffle(
				_.shuffle(_.shuffle(this.challengeWords)),
			);
		},

		// wordSelected is called each time a word is selected. It
		// checks whether the word is a valid seed word and updates
		// the variables that keep track of the correctness of the
		// challenge.
		wordSelected(wordIndex: number) {
			if (this.correctIndices.length === 4 || this.attempts === 0) {
				return;
			}

			const selectedWord = this.challengeWords[wordIndex];
			if (_.includes(this.correctIndices, wordIndex)) {
				return;
			}

			this.attempts--;

			if (_.includes(this.seedWords, selectedWord)) {
				this.correctIndices.push(wordIndex);
			} else {
				this.currentErrorIndex = wordIndex;
				setTimeout(() => {
					this.currentErrorIndex = -1;
				}, 500);
			}

			if (this.attempts === 0 && this.correctIndices.length < 4) {
				this.correctIndices = [];
				this.attempts = MaxAttempts;

				// Reshuffle challenge words
				this.challengeWords = _.shuffle(
					_.shuffle(_.shuffle(this.challengeWords)),
				);

				return;
			}
		},

		// isValidWord checjs whether a word located at a
		// given index is included in the list of correct
		// seed words
		isValidWord(wordIndex: number) {
			return _.includes(this.correctIndices, wordIndex);
		},

		// onWalletFinalized is called when WalletFinalized event is received.
		// This indicates that the wallet has been created and stored to disk.
		onWalletFinalized() {
			this.$router.push('dashboard');
		},

		// onEvents hooks this component to events of interest.
		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataWalletEntropy,this.onDataWalletEntropy);
			ipcRenderer.on(ChannelCodes.WalletFinalized,this.onWalletFinalized);
		},

		// onNext is called when the `next` button is clicked.
		// We react to this event by emitting WalletFinalize event
		// which requests the main process to finalize the wallet.
		// The main process will respond with a WalletFinalized event.
		onNext() {
			this.hideAll = true;
			this.$bus.$emit(ModalLoaderOpen);
			ipcRenderer.send(ChannelCodes.WalletFinalize);
		},
	},
};
</script>
