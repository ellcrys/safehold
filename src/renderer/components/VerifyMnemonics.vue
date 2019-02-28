<template>
  <div id="container" class="verify-seed">
    <div class="row no-gutters">
      <div class="col-12">
        <div id="main-split">
          <div class="split-left">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav">
                  <span>Welcome</span>
                  <span>12-Word Seed</span>
                  <span class="active">Verify Seed</span>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="split-left-main">
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
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(0), wrong: currentErrorIndex == 0 }"
                      v-on:click="wordSelected(0)"
                    >{{ this.challengeWords[0] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(1), wrong: currentErrorIndex == 1 }"
                      v-on:click="wordSelected(1)"
                    >{{ this.challengeWords[1] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(2), wrong: currentErrorIndex == 2 }"
                      v-on:click="wordSelected(2)"
                    >{{ this.challengeWords[2] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(3), wrong: currentErrorIndex == 3 }"
                      v-on:click="wordSelected(3)"
                    >{{ this.challengeWords[3] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(4), wrong: currentErrorIndex == 4 }"
                      v-on:click="wordSelected(4)"
                    >{{ this.challengeWords[4] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(5), wrong: currentErrorIndex == 5 }"
                      v-on:click="wordSelected(5)"
                    >{{ this.challengeWords[5] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(6), wrong: currentErrorIndex == 6 }"
                      v-on:click="wordSelected(6)"
                    >{{ this.challengeWords[6] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(7), wrong: currentErrorIndex == 7 }"
                      v-on:click="wordSelected(7)"
                    >{{ this.challengeWords[7] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(8), wrong: currentErrorIndex == 8 }"
                      v-on:click="wordSelected(8)"
                    >{{ this.challengeWords[8] }}</div>
                    <div
                      class="phrase"
                      v-bind:class="{ active: isValidWord(9), wrong: currentErrorIndex == 9 }"
                      v-on:click="wordSelected(9)"
                    >{{ this.challengeWords[9] }}</div>
                  </div>

                  <div class="form-wrapper">
                    <div class="form-element button-area">
                      <button
                        class="btn btn-primary split-left-button"
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
const randomWords = require('./data/random-words.json');
import * as _ from 'lodash';

const MaxAttempts = 4;

export default {
	data() {
		return {
			seedWords: [],
			challengeWords: [],
			currentErrorIndex: -1,
			correctIndices: [],
			attempts: MaxAttempts,
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
		ipcRenderer.removeListener(
			ChannelCodes.WalletFinalized,
			this.onWalletFinalized,
		);
	},

	methods: {
		onAppErr(event, err) {
			console.error('Err', err);
		},

		onDataWalletEntropy(event, seed) {
			this.seedWords = bip39.entropyToMnemonic(seed).split(' ');
			console.log(this.seedWords);

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
			for (let i = 0; i < 6; i++) {
				this.challengeWords.push(shuffled[i]);
			}

			// Finally, shuffle the challenge words
			this.challengeWords = _.shuffle(
				_.shuffle(_.shuffle(this.challengeWords)),
			);
		},

		wordSelected(wordIndex: number) {
			if (this.correctIndices.length === 4 || this.attempts === 0) {
				return;
			}

			this.attempts--;
			const selectedWord = this.challengeWords[wordIndex];

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

		isValidWord(wordIndex: number) {
			return _.includes(this.correctIndices, wordIndex);
		},

		onWalletFinalized() {
			this.$router.push('dashboard');
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
			ipcRenderer.on(
				ChannelCodes.WalletFinalized,
				this.onWalletFinalized,
			);
		},

		onNext() {
			ipcRenderer.send(ChannelCodes.WalletFinalize);
		},
	},
};
</script>
