<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">


                  <!-- New Account Comienza  -->

        <div class="" id="new-account-wrapper">

            <div class="overlay-content">
                <div class="overlay-header">
                    <h1>New Account</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <!-- Phase 1 -->
                    <div class="phase phase-1">

                        <h1 class="overlay-heading">Create New Account</h1>
                        <span class="overlay-subheading">You can set up a new account easily</span>

                        <form action="" id="" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Enter Account Name</label>
                                    <input type="text" placeholder="John Doe" />
                                    <strong>Invalid password</strong>
                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">Create</button>
                                </div>

                            </div>

                        </form>

                    </div>
                    <!-- Phase 1 -->

                    <!-- Phase 2 -->

                    <div class="phase phase-2">

                        <h1 class="overlay-heading">Treat your private key with care</h1>
                        <span class="overlay-subheading">You can set up a new account by inputing a password</span>

                        <form action="" id="copy-private-key-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="form-element">
                                    <label>Your 94-character private key</label>
                                    <textarea disabled>wKSAjVeUSRZZA3esRirDUzvA4vjV761bsMQY4rWL8gcbUgB1vXGiBS32dtLtoNY2djZ7Ugzvax8YYPVUCz5qRxGFt6GHz8</textarea>
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
                                    <button class="split-left-button" type="submit">Complete - Step 2 of 2</button>
                                </div>

                            </div>

                        </form>

                    </div>

                    <!-- Phase 2 -->

                    <!-- Phase 3 -->

                    <div class="phase phase-3">

                        <img class="overlay-large-image" src="../../assets/img/account-created.svg" />

                        <h2 class="overlay-heading-2">New account created!</h2>

                        <form action="" id="view-account-form" method="" novalidate>

                            <div class="form-wrapper">

                                <div class="account-address">
                                    <img src="../../assets/img/account-qr-code.png" />
                                    <div>
                                        <h3>Account address</h3>
                                        <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
                                    </div>

                                </div>

                                <div class="form-element">
                                    <button class="split-left-button" type="submit">View Account</button>
                                </div>

                            </div>

                        </form>

                    </div>

                    <!-- Phase 3 -->

                </div>

            </div>

        </div>

        <!-- New Account Extremos  -->




      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalNewAccountOpen,
	ModalNewAccountClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalNewAccountOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalNewAccountClose, () => {
			this.open = false;
		});
	},
	methods: {
		
	},
};
</script>
