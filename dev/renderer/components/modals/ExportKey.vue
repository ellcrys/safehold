<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">

        <!-- Export Private Key Comienza  -->

        <div class="" id="export-private-key-wrapper">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>Export Account Private Key</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">
                    <!-- Phase 1 -->
                    <div class="phase phase-1">

                        <h1 class="overlay-heading">Confirmation Required</h1>
                        <span class="overlay-subheading">Kindly provide the password to this account address</span>

                        <form action="" id="" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="account-address">
                                    <img src="../../assets/img/account-qr-code.png" />
                                    <div>
                                        <h3>Account address</h3>
                                        <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <label>Enter Password</label>
                                    <input type="password" placeholder="*******************************" />
                                    <strong>Invalid private key</strong>
                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Continue</button>
                                </div>

                            </div>

                        </form>

                    </div>
                    <!-- Phase 1 -->

                    <!-- Phase 2 -->

                    <div class="phase phase-2">

                        <h1 class="overlay-heading">Download Private Key</h1>
                        <span class="overlay-subheading">Kindly provide the password to this account address</span>

                        <form action="" id="" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="account-address">
                                    <img src="../../assets/img/account-qr-code.png" />
                                    <div>
                                        <h3>Account address</h3>
                                        <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Download Private Key</button>
                                </div>

                            </div>

                        </form>

                    </div>

                    <!-- Phase 2 -->

                </div>

            </div>

        </div>

        <!-- Export Private Key Extremos  -->




      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalExportKeyOpen,
	ModalExportKeyClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalExportKeyOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalExportKeyClose, () => {
			this.open = false;
		});
	},
	methods: {
		
	},
};
</script>
