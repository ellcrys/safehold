<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane h10pct">


        <!-- SignIn Success Comienza  -->

        <div class="" id="signin-success-wrapper">

            <div class="overlay-content">

                <div class="overlay-header">
                    <h1>Sign in Successful</h1>
                    <button class="overlay-close"></button>
                </div>

                <div class="overlay-main">

                    <img class="overlay-large-image" src="../../assets/img/signin-sucess.svg" />

                    <h2 class="overlay-heading-2">Sign in Successful!</h2>

                    <p>Welcome to SafeHold.</p>
                    <p>Send, receive and manage transactions on the Ellcrys blockchain</p>

                    <form action="" id="" method="" novalidate>

                        <div class="form-wrapper">

                            <div class="form-element">
                                <button class="split-left-button" type="submit">Explore SafeHold</button>
                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>

        <!-- SignIn Success Extremos -->




      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import {
	ModalSigninSuccessOpen,
	ModalSigninSuccessClose,
} from '../constants/events';


export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalSigninSuccessOpen, seedWords => {
			this.open = true;
		});

		this.$bus.$on(ModalSigninSuccessClose, () => {
			this.open = false;
		});
	},
	methods: {

	},
};
</script>
