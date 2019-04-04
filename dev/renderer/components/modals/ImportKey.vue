<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">


                  <!-- Import Private Key Comienza  -->

        <div class="" id="import-private-key-wrapper">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>Import Private Key</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <!-- Phase 1 -->
                    <div class="phase phase-1">
                        <div id="import-options">

                            <div class="option active">
                                <div></div>
                                <h3>Import Seed Phrase</h3>
                                <p>Retrieve account private key from your backup SEED</p>
                            </div>

                            <div class="option">
                                <div></div>
                                <h3>Import Private Key</h3>
                                <p>Retrieve account private key from your secure password</p>
                            </div>

                        </div>

                    </div>
                    <!-- Phase 1 -->

                    <!-- Phase 2 -->

                    <div class="phase phase-2">

                        <form action="" id="import-phrase-form" method="" novalidate>

                            <div class="form-wrapper">
                                <div class="form-element">
                                    <label>Input your 15 word seed phrase</label>
                                    <textarea></textarea>
                                    <strong>Invalid seed phrase</strong>
                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Continue</button>
                                </div>

                            </div>

                        </form>

                        <button class="go-back-btn">Go Back</button>

                    </div>

                    <!-- Phase 2 -->

                    <!-- Phase 3 -->

                    <div class="phase phase-3">

                        <form action="" id="import-key-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Paste your 94-character private key</label>
                                    <textarea>wKSAjVeUSRZZA3esRirDUzvA4vjV761bsMQY4rWL8gcbUgB1vXGiBS32dtLtoNY2djZ7Ugzvax8YYPVUCz5qRxGFt6GHz8</textarea>
                                    <strong>Invalid private key</strong>
                                </div>

                                <div class="account-address">
                                    <img src="../../assets/img/account-qr-code.png" />
                                    <div>
                                        <h3>Account address</h3>
                                        <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Continue</button>
                                </div>

                            </div>

                        </form>

                        <button class="go-back-btn">Go Back</button>

                    </div>

                    <!-- Phase 3 -->

                </div>

            </div>

        </div>

        <!-- Import Private Key Extremos  -->




      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalImportKeyOpen,
	ModalImportKeyClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalImportKeyOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalImportKeyClose, () => {
			this.open = false;
		});
	},
	methods: {
		
	},
};
</script>
