<template>
  <div id="app">
    <Modal/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import './assets/css/font.css';
import './assets/css/default.css';
import './assets/css/form.scss';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/app.scss';
import Vue from 'vue';

const EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
	$bus: {
		get: function() {
			return EventBus;
		},
	},
});

export default {
	name: 'safehold',
};
</script>
