<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane h10pct">


        <div class="" id="transaction-success-wrapper">

            <div class="overlay-content">

                <div class="overlay-header">
                    <h1>Transaction Successful</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <img class="overlay-large-image" src="../../assets/img/crypto.svg" />

                    <h2 class="overlay-heading-2">Transaction successful!</h2>

                    <p>You sent <strong>138.994 ELL</strong> to:</p>

                    <p><span>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</span></p>
                    <p>from your account:</p>
                    <p><span class="active">eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</span></p>

                    <div id="transaction-size">
                        <span><em>Tnx</em> size 2.3kb</span>
                        <a href="">View txn on Ellscan</a>
                    </div>



                    <div class="txn-hash">
                        <span>Txn Hash:</span>
                        <div>
                            <p>0xa09046714c3a3ebdd26a6d8dd5affa5d43272416845c388a9c6eccb4f0948102</p>
                            <button>Copy</button>
                        </div>
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
	ModalTxnSuccessOpen,
	ModalTxnSuccessClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalTxnSuccessOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalTxnSuccessClose, () => {
			this.open = false;
		});
	},
	methods: {

	},
};
</script>
