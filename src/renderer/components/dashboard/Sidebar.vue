<template>
  <div id="side-navigation-wrapper" class="shift-content-top-mobile">
    <img id="logo" src="../../assets/img/logo.svg">

    <img id="logo-small" src="../../assets/img/logo-small.svg">

    <div id="miner-engine-switch-wrapper">
      <div class="shift-content-top">
        <div class="switch" v-on:click="toggleMiner">
          <button v-bind:class="{on: mining.on }" id="miner-switch"></button>
          <p v-if="!mining.on">START MINING</p>
          <p v-if="mining.on">STOP MINING</p>
        </div>
      </div>
    </div>

    <div class="shift-content-top">
      <div id="transaction-action-trigger-group">
        <a class="flex popup-trigger" data-target="send-from-wallet">
          <span>Send</span>
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
            <a>Accounts</a>
          </strong>
          <span>10</span>
        </div>
        <div
          id="account-nav-wrapper"
          :class="[ subMenu.expandState ? 'expand' : '' ]"
          class="sub-nav-wrapper"
        >
          <a
            href="#"
            v-for="(account) in accounts"
            :key="account.address"
            class="sub-nav active"
            v-on:click="$router.push('account')"
          >
            <div class="shift-content">
              <img :src="makeAvatar(account.address)">
              <em contenteditable="true">{{ account.name }}</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eKsEX...Fwn3g</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eGFi9...TUCxp</em>
            </div>
          </a>

          <!----- -------->
          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">e7p8Z...SkrTT</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eKsEX...Fwn3g</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eGFi9...TUCxp</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav active">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">e7p8Z...SkrTT</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eKsEX...Fwn3g</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eGFi9...TUCxp</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">e7p8Z...SkrTT</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eKsEX...Fwn3g</em>
            </div>
          </a>

          <a href="account.html" class="sub-nav">
            <div class="shift-content">
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em contenteditable="true">eGFi9...TUCxp</em>
            </div>
          </a>

          <!----- -------->
        </div>
        <div class="shift-content">
          <button @click="seeMoreSideBar()" id="see-more">{{ this.subMenu.menuStatus }}</button>
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
          <div class="roller roller-green">
            <svg viewBox="0 0 36 36">
              <path
                class="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <path
                class="circle"
                stroke-dasharray="30 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <text x="18" y="20.35" class="percentage">30%</text>
            </svg>
          </div>
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
import Account from '../../../core/account';
import Mixin from './Mixin';
import { MinerStarted, MinerStopped } from '../constants/events';

export default {
	props: {
		accounts: Array,
	},

	mixins: [Mixin],

	data() {
		return {
			mining: {
				on: false,
			},
			subMenu: {
				expandState: false,
				menuStatus: 'See More',
			},
		};
	},

	created() {
		this.onEvents();
	},

	watch: {},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},

		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			this.$bus.$on(MinerStarted, () => (this.mining.on = true));
			this.$bus.$on(MinerStopped, () => (this.mining.on = false));
		},

		toggleMiner() {
			this.mining.on = !this.mining.on;
			if (this.mining.on) {
				this.$bus.$emit(MinerStarted);
				return ipcRenderer.send(ChannelCodes.MinerStart);
			}
			this.$bus.$emit(MinerStopped);
			ipcRenderer.send(ChannelCodes.MinerStop);
		},

		seeMoreSideBar() {
			this.subMenu.expandState = !this.subMenu.expandState;

			if (this.subMenu.expandState == true) {
				this.subMenu.menuStatus = 'See Less';
			} else {
				this.subMenu.menuStatus = 'See More';
			}
		},
	},
};
</script>
