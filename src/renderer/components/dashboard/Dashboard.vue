<template>
  <div id="container-dashboard">
    <Header/>

    <div id="main">
      <Sidebar/>
      <div class="content-wrapper-main" id="content-wrapper-main">
        <transition name="slide-left">
          <router-view class="router-view"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Miner from './miner';
import { setInterval } from 'timers';
import Sidebar from './Sidebar.vue';
import MinerView from './MinerView.vue';
import Header from './Header.vue';
import OverviewView from './OverviewView.vue';
import AccountView from './AccountView.vue';

// refreshInt holds a reference to the
// content refresh interval
let refreshInt;

// refreshDur is the time between each
// content referesh
const refreshDur = 5000;

export default {
	components: {
		Sidebar,
		MinerView,
		Header,
		OverviewView,
		AccountView,
	},

	data() {
		return {};
	},

	created() {
		this.onEvents();
		this.refresh();
	},

	mounted() {
		this.$router.push('index');
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},

		/**
		 * Listen for incoming IPC events
		 */
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},

		refresh() {
			console.log('Hello');
		},
	},
};
</script>
