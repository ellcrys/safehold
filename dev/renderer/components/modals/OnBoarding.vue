<template>
  <div>
    <transition name="fade">
      <div class="modal-overlay" id="overlay" v-if="open">
        <div class="modal-pane modal-flex" v-if="open && slide1">
          <div class="onboarding-main-split">
            <div class="flex-layout">
              <div class="flex-left split-left onboarding-1-bg"></div>
              <div class="flex-right split-right">
                <div class="item header">
                  <h1 class="split-right-header">Welcome to SafeHold</h1>
                </div>
                <div class="item content">
                  SafeHold is a blockchain hub that allows you to join the Ellcrys network. With it, you will be able to
                  send ELL, receive ELL and mine blocks using the embedded CPU-miner. SafeHold enables every category of users
                  to interact with the Ellcrys' Alpha network.
                  <br>
                  <br>
                  <b>Note:</b>
                  The software is a an early alpha version with limited features. More features will
                  be added as we improve the protocol.
                  <br>
                  <br>
                  <br>
                  <br>

                  <div class="article-split-wrapper">
                    <div class="article">
                      <div class="article-section">
                        <h3>Wallet System</h3>
                        <p
                          class="light"
                        >Send and receive our native coins, and manage multiple accounts.</p>
                      </div>
                    </div>

                    <div class="article">
                      <div class="article-section">
                        <h3>CPU Miner</h3>
                        <p class="light">Join and contribute to the network by mining blocks.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item footer">
                  <div class="split-right-footer">
                    <button class="next" @click="toNextSlide(2)">Next</button>

                    <ul class="page-switcher">
                      <li @click="toNextSlide(1)" class="active"></li>
                      <li @click="toNextSlide(2)"></li>
                      <li @click="toNextSlide(3)"></li>
                      <li @click="toNextSlide(4)"></li>
                    </ul>

                    <button class="skip" @click="doneOnboarding()">Skip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-pane modal-flex" v-if="open && slide2">
          <div class="onboarding-main-split">
            <div class="flex-layout">
              <div class="flex-left split-left onboarding-1-bg"></div>
              <div class="flex-right split-right">
                <div class="item header">
                  <h1 class="split-right-header">You Now Have A Wallet!</h1>
                </div>
                <div class="item content">
                  This wallet allow you to interact with the Ellcrys network and managing your Ellcrys native
                  coin “ELL”. You will be able to send and receive ELL coins, and also track your transactions.
                  <br>
                  <br>You wallet is encrypted and stored on your computer using your
                  passphrase as the encryption key. Whenever you log in, your
                  wallet is unlocked using the passphrase.
                  <br>
                  <br>During the sign up process, you were given a 12-words phrase.
                  These 12 words are used to create the master seed from which
                  all accounts of this wallet are generated from. If you
                  lose your computer, you will be able to retrieve all your
                  accounts using your 12-words phrase. Please keep it safe.
                  <br>
                  <br>
                </div>
                <div class="item footer">
                  <div class="split-right-footer">
                    <button class="next" @click="toNextSlide(3)">Next</button>

                    <ul class="page-switcher">
                      <li @click="toNextSlide(1)"></li>
                      <li @click="toNextSlide(2)" class="active"></li>
                      <li @click="toNextSlide(3)"></li>
                      <li @click="toNextSlide(4)"></li>
                    </ul>

                    <button class="skip" @click="doneOnboarding()">Skip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-pane modal-flex" v-if="open && slide3">
          <div class="onboarding-main-split">
            <div class="flex-layout">
              <div class="flex-left split-left onboarding-3-bg"></div>
              <div class="flex-right split-right">
                <div class="item header">
                  <h1 class="split-right-header">CPU Miner Is Also Included</h1>
                </div>
                <div class="item content">
                  The CPU miner allows you to miner blocks and receive
                  all associated rewards. The current test network this
                  wallet is connected to only rewards miners with transaction
                  fees.
                  <br>
                  <br>The blocks that you have mined, the state of your miner and other mining
                  information can be found on the miner page.
                  <br>
                  <br>Ellcrys uses the BLAKE2-256 hash function.
                  <br>
                  <br>The blocks that you have mined, the state of your miner and other mining
                  information can be found on the miner page.
                </div>
                <div class="item footer">
                  <div class="split-right-footer">
                    <button class="next" @click="toNextSlide(4)">Next</button>

                    <ul class="page-switcher">
                      <li @click="toNextSlide(1)"></li>
                      <li @click="toNextSlide(2)"></li>
                      <li @click="toNextSlide(3)" class="active"></li>
                      <li @click="toNextSlide(4)"></li>
                    </ul>

                    <button class="skip" @click="doneOnboarding()">Skip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-pane modal-flex" v-if="open && slide4">
          <div class="onboarding-main-split">
            <div class="flex-layout">
              <div class="flex-left split-left onboarding-4-bg"></div>
              <div class="flex-right split-right">
                <div class="item header">
                  <h1 class="split-right-header">Safety Tips</h1>
                </div>
                <div class="item content">
                  Only You are responsible for your security. Always keep your
                  seed key and password safe. If you lose them, nobody else can recover it.
                  <br>
                  <br>When something doesn’t seem right or you don’t understand it,
                  ask questions and do your own research. Avoid making a decision based on fear.
                  <br>
                  <br>Do not enter your seed key to any website. Nobody can reverse,
                  cancel or refund transactions if your wallet has been compromised.
                  <br>
                  <br>Make a backup of your seed key and password. Don’t store
                  it on your computer, instead write it down or print it out on
                  a piece of paper or save it to a USB drive.
                </div>
                <div class="item footer">
                  <div class="split-right-footer">
                    <button class="next" @click="doneOnboarding()">Next</button>

                    <ul class="page-switcher">
                      <li @click="toNextSlide(1)"></li>
                      <li @click="toNextSlide(2)"></li>
                      <li @click="toNextSlide(3)"></li>
                      <li @click="toNextSlide(4)" class="active"></li>
                    </ul>

                    <button class="skip" @click="doneOnboarding()">Skip</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ModalOnBoardingOpen, ModalOnBoardingClose } from '../constants/events';
export default {
	data() {
		return {
			open: false,

			slide1: true,
			slide2: false,
			slide3: false,
			slide4: false,
		};
	},
	created() {
		this.$bus.$on(ModalOnBoardingOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalOnBoardingClose, () => {
			this.open = false;
		});
	},
	methods: {
		doneOnboarding() {
			this.$bus.$emit(ModalOnBoardingClose);

			this.slide2 = false;
			this.slide3 = false;
			this.slide4 = false;

			this.slide1 = true;
		},

		toNextSlide(slideNumber: number) {
			this.slide1 = false;
			this.slide2 = false;
			this.slide3 = false;
			this.slide4 = false;

			if (slideNumber === 1) {
				this.slide1 = true;
				return;
			}

			if (slideNumber === 2) {
				this.slide2 = true;
				return;
			}

			if (slideNumber === 3) {
				this.slide3 = true;
				return;
			}

			if (slideNumber === 4) {
				this.slide4 = true;
				return;
			}
		},
	},
};
</script>
