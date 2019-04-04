<template>
  <transition name="fade">
    <div class="modal-overlay loader" id="overlay" v-if="open">
      <img src="../../assets/img/rolling.svg" alt>
    </div>
  </transition>
</template>


<script lang="ts">
import { ModalLoaderOpen, ModalLoaderClose } from '../constants/events';

export default {
	data() {
		return {
			open: false,
		};
	},
	created() {
		this.$bus.$on(ModalLoaderOpen, () => {
			this.open = true;
		});

		this.$bus.$on(ModalLoaderClose, () => {
			this.open = false;
		});
	},
	methods: {},
};
</script>
