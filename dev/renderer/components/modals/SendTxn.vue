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

                     <!-- Phase 1 -->
                    <div class="phase phase-1">

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
                 <!-- Phase 1 -->




                <!-- Phase 2 -->


                <div class="phase phase-2">

                    <div id="send-receipt-amount-section">
                        <h1>10.00921 ELL</h1>
                        <span>Amount Transacted</span>
                    </div>


                    <div id="send-receipt-main-content">

                        <div class="txn-hash">
                            <span>Txn Hash:</span>
                            <div>
                                <p>0xa09046714c3a3ebdd26a6d8dd5affa5d43272416845c388a9c6eccb4f0948102</p>
                                <button>Copy</button>
                            </div>
                        </div>
                        <div class="account-switcher">

                            <label>Sender Address:</label>

                            <div class="account-wrapper">
                                <div class="account target">
                                    <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                    <span><em>Bal:</em> 483,993,003.0390 ELL</span>
                                </div>
                            </div>


                            <label>Recipient Address:</label>
                            <div class="account-wrapper">
                                <div class="account">
                                    <strong>eCAMMWp4SERey2QJybU1Dmw8tRb6Y57uAL</strong>
                                </div>
                            </div>

                            
                        </div>


                        <div id="send-receipt-system-data">

                            <div class="section">
                                <strong>0.00373 ell</strong>
                                <span>Transaction fee</span>
                            </div>

                            <div class="section">
                                <strong>2 seconds ago</strong>
                                <span>Jan-14-2019 05:03:29 PM + UTC</span>
                            </div>

                        </div>


                        <div id="send-receipt-button-group">
                            <button>Decline</button>
                            <button>Confirm</button>
                        </div>


                    </div>



                </div>

                <!-- Phase 2 -->




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
			open: true,
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
