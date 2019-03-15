<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">



        <div class="" id="receive-to-wallet">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>Receive To Ellcrys Wallet</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <div class="account-switcher">

                        <button class="control control-left">&lt;</button>
                        
                        <button class="control control-right">&gt;</button>

                        <div class="account-wrapper">

                            <div class="account active">
                                <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                            </div>

                            <div class="account">
                                <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                            </div>

                        </div>

                        <ul class="account-carousel-dots">
                            <li class="active"></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>

                    </div>

                    <div id="receive-to-wallet-qr-wrapper">

                        <img src="../../assets/img/wallet-qr-code.svg" />

                        <div id="receive-to-wallet-account-section">
                            <span>0x9A2bc127bC5Db5888415D2Aa7B20A99EFac94Aa6</span>
                            <button>Copy</button>
                        </div>

                        <a href="">View on Ellscan</a>

                    </div>

                </div>

            </div>

        </div> 

















      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalReceiveOpen,
	ModalReceiveClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalReceiveOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalReceiveClose, () => {
			this.open = false;
		});
	},
	methods: {
		
	},
};
</script>
