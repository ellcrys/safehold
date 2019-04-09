<template>
  <div>
    <VueCarousel
      :data="slideData"
      :indicators="false"
      :controls="false"
      :interval="5000"
      direction="left"
    />
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../core/channel_codes';
import Mixin from './dashboard/Mixin';
import * as VueCarousel from '@chenfengyuan/vue-carousel';

export default {
	data() {
		return {
			slideData: [
				`<div class="step1"></div>`,
				`<div class="step2"></div>`,
				`<div class="step3"></div>`,
			],
		};
	},

	components: {
		VueCarousel,
	},

	// created is a lifecycle method of vue.
	created() {
		this.onEvents();
	},

	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {},

		// onEvents hooks this component to events of interest.
		onEvents() {},
	},
};
</script>
