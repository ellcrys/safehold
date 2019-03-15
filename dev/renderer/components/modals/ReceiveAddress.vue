<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="open">
      <div class="modal-pane big">
        <div class="title">
          <span class="d-inline-block float-right">
            <img
              src="../../assets/img/close-white.svg"
              alt="Close"
              class="close"
              v-on:click="open=false"
            >
          </span>
          Receive To Account
        </div>
        <div class="overlay-main">
          <div class="account-switcher">
            <div class="account-wrapper">
              <div class="account active">
                <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                <span>
                  <em>Bal:</em> 483,993,003.0390 ELL
                </span>
              </div>

              <div class="account">
                <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                <span>
                  <em>Bal:</em> 483,993,003.0390 ELL
                </span>
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
            <img src="img/wallet-qr-code.svg">

            <div id="receive-to-wallet-account-section">
              <span>0x9A2bc127bC5Db5888415D2Aa7B20A99EFac94Aa6</span>
              <button>Copy</button>
            </div>

            <a href>View on Ellscan</a>
          </div>
        </div>
        <div class="button-area">
          <input type="button" class="btn btn-confirm">
        </div>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalReceiveAddressOpen,
	ModalReceiveAddressClose,
} from '../constants/events';

export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalReceiveAddressOpen, () => {
			this.open = true;
		});

		this.$bus.$on(ModalReceiveAddressClose, () => {
			this.open = false;
		});
	},
	methods: {},
};
</script>
