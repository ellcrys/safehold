<template>
	<div>
		<OnBoarding1 />
		<!-- <OnBoarding2 /> -->
		<!-- <OnBoarding3 /> -->
		<!-- <OnBoarding4 />  -->


	</div>

</template>


<script lang="ts">

import OnBoarding1 from './OnBoarding1.vue';
import OnBoarding2 from './OnBoarding2.vue';
import OnBoarding3 from './OnBoarding3.vue';
import OnBoarding4 from './OnBoarding4.vue';

export default {
	components: {
		OnBoarding1,
		OnBoarding2,
		OnBoarding3,
		OnBoarding4,
	},

	data() {
		return {};
	},
};
</script>
