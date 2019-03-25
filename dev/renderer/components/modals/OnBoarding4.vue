<template>
    <transition name="fade">
        <div class="modal-overlay" id="overlay" v-if="open">
            <div class="modal-pane modal-flex">

                <div class="onboarding-main-split">

                    <div class="flex-layout">

                        <div class="flex-left split-left onboarding-4-bg">
                            <!-- <img src="../../assets/img/Onboarding4.svg" /> -->
                        </div>

                        <div class="flex-right split-right">

                            <h1 class="split-right-header">Safety Tips</h1>

                            <div class="split-right-main">
                                <div class="article-split-wrapper">

                                    <div class="article">
                                        <div class="article-section">
                                            <p>Only You are responsible for your security. Always keep your seed key and password safe. If you lose them, nobody else can recover it.</p>
                                        </div>

                                        <div class="article-section">
                                            <p><span>When something doesn’t seem right or you don’t understand it, ask questions and do your own research. Avoid making a decision based on fear.</span></p>
                                        </div>
                                    </div>

                                    <div class="article">
                                        <div class="article-section">
                                            <p>Do not enter your seed key to any website. Nobody can reverse, cancel or refund transactions if your wallet has been compromised.</p>
                                        </div>

                                        <div class="article-section">
                                            <p>Make a backup of your seed key and password. Don’t store it on your computer, instead write it down or print it out on a piece of paper or save it to a USB drive.</p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="split-right-footer">
                                <button class="next" @click="toNextSlide()">Next</button>

                                <ul class="page-switcher">
                                    <li class="active"></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>

                                <button class="skip">Skip</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { ModalOnBoardingOpen, ModalOnBoardingClose } from '../constants/events';
export default {
	data() {
		return {
			open: true,
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
	methods: {},
};
</script>
