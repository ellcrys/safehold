<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">


          <div class="" id="send-from-wallet">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>Send from Ellcrys Wallet</h1>
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

                    <form action="" id="send-from-wallet-form" method="" novalidate>

                        <div class="form-wrapper">

                            <div class="form-element">
                                <label>Account</label>

                                <div class="amount-input">
                                    <input type="text" placeholder="2,002" />
                                    <span>ELL</span>
                                </div>

                                <strong>Invalid Amount</strong>
                            </div>

                            <div class="form-element">
                                <label>Recipient Address</label>
                                <input type="text" placeholder="e2..." />
                                <strong>Invalid Address</strong>
                            </div>

                            <div class="form-element">
                                <label>Transaction Fee</label>
                                <input type="text" placeholder="0.03" />
                                <strong>Invalid Fee</strong>
                            </div>

                            <div class="form-element">
                                <button class="split-left-button" type="submit">Send</button>
                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div> 


      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalSendOpen,
	ModalSendClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalSendOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalSendClose, () => {
			this.open = false;
		});
	},
	methods: {
		
	},
};
</script>
