<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="open">
      <div class="modal-pane big">
        <div class="title danger">
          <span class="d-inline-block float-right">
            <img
              src="../../assets/img/close-white.svg"
              alt="Close"
              class="close"
              v-on:click="open=false"
            >
          </span>
          Confirm Seed Copy Warning
        </div>

        <div class="text">
          Please be aware that copying your seed to the clipboard exposes it to other applications
          that may be monitoring and collecting contents stored in the clipboard.
          <br>
          <br>Do not store your seed on a computer without encryption as it can be
          accessed and stolen by anyone who gains access to the computer.
          <br>
          <br>Storing your seed on a computer without writing it out on a paper (stored in a secret location) can lead to loss of
          funds in the event that the computer goes missing, becomes inaccessible due to hardware
          failure or the wallet file is corrupted.
          <br>
          <br>If you are sure that you know what you are doing and want to copy your seed to the
          clipboard, please click the button below. If you are not sure, please close this
          dialog.
        </div>
		
        <div class="button-area">
          <input
            type="button"
            v-bind:value="btnValue"
            v-on:click="onCopy"
            class="btn btn-confirm btn-danger"
          >
        </div>
      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalConfirmCopyOpen,
	ModalConfirmCopyClose,
} from '../constants/events';

const btnValue = 'I understand. Copy!';

export default {
	data() {
		return {
			open: false,
			seedWords: '',
			btnValue: btnValue,
		};
	},
	created() {
		this.$bus.$on(ModalConfirmCopyOpen, seedWords => {
			this.seedWords = seedWords;
			this.open = true;
		});

		this.$bus.$on(ModalConfirmCopyClose, () => {
			this.open = false;
		});
	},
	methods: {
		onCopy() {
			this.$copyText(this.seedWords).then(e => {
				this.btnValue = 'Copied';
				setTimeout(() => {
					this.open = false;
					this.btnValue = btnValue;
				}, 500);
			});
		},
	},
};
</script>
