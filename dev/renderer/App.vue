<template>
  <div id="app">
    <Modal/>
    <transition name="slide-left">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import './assets/css/font.css';
import './assets/css/default.scss';
import './assets/css/form.scss';
import './assets/css/dashboard.scss';
import './assets/css/onboarding.scss';
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
	name: 'SafeHold',
};
</script>
