<template>
  <div id="side-navigation-wrapper" class="shift-content-top-mobile">
    <img id="logo" src="../../assets/img/logo.svg">

    <img id="logo-small" src="../../assets/img/logo-small.svg">

    <div id="miner-engine-switch-wrapper">
      <div class="shift-content-top">
        <div class="switch" v-on:click="mining.on = !mining.on">
          <button v-bind:class="{on: mining.on }" id="miner-switch"></button>
          <p v-if="!mining.on">Miner OFF</p>
          <p v-if="mining.on">Miner ON</p>
        </div>
      </div>
    </div>

    <div class="shift-content-top">
      <div id="transaction-action-trigger-group">
        <a class="flex popup-trigger" data-target="send-from-wallet">
          <span>Send txn</span>
        </a>
        <a class="flex popup-trigger" data-target="receive-to-wallet">
          <span>Receive</span>
        </a>
      </div>
    </div>

    <div class="divider"></div>

    <div class="side-nav">
      <div class="nav active">
        <div class="shift-content">
          <img src="../../assets/icon/icon-home.svg">
          <strong>
            <a v-on:click="$router.push('index')">Overview</a>
          </strong>
        </div>
      </div>

      <div class="nav" id="account-nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-customization.svg">
          <strong>
            <a v-on:click="$router.push('account')">Accounts</a>
          </strong>
          <span>10</span>

          <div class="sub-nav-wrapper">
            <a href="account.html" class="sub-nav">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em>e7p8Z...SkrTT</em>
            </a>

            <a href="account.html" class="sub-nav">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em>eKsEX...Fwn3g</em>
            </a>

            <a href="account.html" class="sub-nav">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em>eGFi9...TUCxp</em>
            </a>

            <button id="see-more">See more</button>
          </div>
        </div>
      </div>

      <div class="nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-real-time.svg">
          <strong>
            <a v-on:click="$router.push('miner')">Miner</a>
          </strong>
        </div>
      </div>
    </div>

    <div class="divider">
      <span>Tools</span>
    </div>

    <div class="side-nav">
      <div class="nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-audience.svg">
          <strong>
            <a href="exportwallet.html">Export Wallets</a>
          </strong>
        </div>
      </div>

      <div class="nav">
        <div class="shift-content">
          <img src="../../assets/icon/icon-acquisition-copy.svg">
          <strong>
            <a href="log.html">Log</a>
          </strong>
        </div>
      </div>
    </div>

    <div id="side-nav-footer-content">
      <div class="section">
        <div class="shift-content">
          <p>
            Last Block:
            <span>322269</span>
          </p>
          <em>56 mins ago</em>
          <strong>65%</strong>
        </div>
      </div>

      <div class="section">
        <div class="shift-content">
          <a class="active" href>Refresh account</a>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Miner from './miner';

export default {
	data() {
		return {
			mining: {
				on: false,
			},
		};
	},

	created() {
		this.onEvents();
	},

	watch: {
		// Start or stop the miner
		'mining.on': on => {
			if (on) {
				return Miner.startMiner();
			} else {
				Miner.stopMiner();
			}
		},
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},
	},
};
</script>
