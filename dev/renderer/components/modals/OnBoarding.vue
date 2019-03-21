<template>
  <transition name="fade">
    <div class="modal-overlay" id="overlay" v-if="open">
      <div class="modal-pane">

        <!-- <div class="onboarding-main-split">

            <div class="split-left">

              
            </div>
             

            <div class="split-right">


            </div>

        </div> -->




      </div>
    </div>
  </transition>
</template>


<script lang="ts">
import { ModalNewAccountOpen, ModalOnBoardingOpen } from '../constants/events';
export default {
	data() {
		return {
			open: false,
		};
	},
	created() {

		// this.$bus.$on(ModalOnBoardingOpen, seedWords => {
		// 	this.open = true;
		// });

		// this.$bus.$on(ModalOnBoardingClose, () => {
		// 	this.open = false;
		// });
	},
	methods: {
		
	},
};
</script>
