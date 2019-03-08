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
          <span>Receive txn</span>
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
        </div>
          <div id="account-nav-wrapper"  :class="[ subMenu.expandState ? 'expand' : '' ]" class="sub-nav-wrapper">
            <a
              href="account.html"
              class="sub-nav"
              v-for="(account) in accounts"
              :key="account.address"
            >
              <img src="../../assets/icon/img-20170731-113126.svg">
              <em>{{ account.name }}</em>
            </a>

            <a  href="account.html" class="sub-nav active">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>e7p8Z...SkrTT</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eKsEX...Fwn3g</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
               <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eGFi9...TUCxp</em>
               </div>
            </a>




            <!----- -------->


            <a  href="account.html" class="sub-nav active">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>e7p8Z...SkrTT</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eKsEX...Fwn3g</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
               <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eGFi9...TUCxp</em>
               </div>
            </a>




            <a  href="account.html" class="sub-nav active">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>e7p8Z...SkrTT</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eKsEX...Fwn3g</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
               <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eGFi9...TUCxp</em>
               </div>
            </a>




            <a  href="account.html" class="sub-nav">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>e7p8Z...SkrTT</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
              <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eKsEX...Fwn3g</em>
              </div>
            </a>

            <a href="account.html" class="sub-nav">
               <div class="shift-content">
                <img src="../../assets/icon/img-20170731-113126.svg">
                <em>eGFi9...TUCxp</em>
               </div>
            </a>

            


            <!----- -------->
          </div>
          <div class="shift-content">
            <button  @click="seeMoreSideBar()" id="see-more">{{ this.subMenu.menuStatus }} </button>
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
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle" stroke-dasharray="30, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
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
import Miner from './miner';
import Account from '../../../core/account';
import Mixin from './Mixin';

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
      subMenu : {
        expandState : false,
        menuStatus : "See More"
      }
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
			const self: any = this;
			ipcRenderer.on(ChannelCodes.AppError, self.onAppErr);
    },
    seeMoreSideBar(){
      this.subMenu.expandState = !this.subMenu.expandState;

      if( this.subMenu.expandState == true){
        this.subMenu.menuStatus = "See Less";
      }else{
        this.subMenu.menuStatus = "See More";
      }
    },

	},
};
</script>
