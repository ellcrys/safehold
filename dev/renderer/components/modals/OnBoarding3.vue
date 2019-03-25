<template>
    <transition name="fade">
        <div class="modal-overlay" id="overlay" v-if="open">
            <div class="modal-pane modal-flex">

                <div class="onboarding-main-split">

                    <div class="flex-layout">

                        <div class="flex-left split-left onboarding-3-bg">

                        </div>
                        <div class="flex-right split-right">

                            <h1 class="split-right-header">What is a desktop miner?</h1>

                            <div class="split-right-main">
                                <div class="article-split-wrapper">

                                    <div class="article">
                                        <div class="article-section">
                                            <p>A desktop miner is a key feature tool for mining (creating) ell coins. You can earn transaction fees from verifying Ellcrys transactions.</p>
                                        </div>

                                        <div class="article-section">
                                            <p><span>Ellcrys uses the Blake2b-256 hashing function. You can use CPUs to do the PoW mining.</span></p>
                                        </div>

                                        <div class="article-section">
                                            <p>You will be notified when you mine a block on the notification page and reward will be disbursed to your account.</p>
                                        </div>
                                    </div>

                                    <div class="article">
                                        <div class="article-section">
                                            <p>As a Miner, you collect transactions from the pool to create to blocks. When a miner successfully finds a correct proof-of-work nonce for a given block, she sends the candidate block to her peers who then validate and add the blocks to their local chain.</p>
                                        </div>

                                        <div class="article-section">
                                            <p>You typically receive a reward that is roughly proportional to the hashrate of your miner machine (CPU) and the overall hashrate of the network when you commit your computer to PoW mining.</p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div class="split-right-footer">
                                <button class="next">Next</button>

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
