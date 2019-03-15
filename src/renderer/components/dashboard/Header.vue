<template>
  <div id="header">
    <div class="content-wrapper-header">
      <div id="search">
        <input type="text" placeholder="Search for transaction, addresses ">
      </div>

      <div id="learn-safehold">
        <span class="tag">New</span>
        <p>Learn SafeHold</p>
        <hr>
        <a href>Take a look</a>
      </div>

      <div id="top-controls-content-wrapper">
        <div id="top-icons">
          <div class="icon">
            <img id="notification-trigger" src="../../assets/icon/notification_inactive.svg">

            <!-- Notification Drop Down -->
            <div class="drop-down hide" id="notification-drop-down">
              <div class="drop-down-header">
                <h1>Notification</h1>
              </div>

              <div class="drop-down-others">
                <button>Clear All</button>
                <div>
                  <label>Push notifications</label>
                  <select>
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              </div>

              <div class="drop-down-main">
                <div class="drop-down-main-options drop-down-icon-padding">
                  <div class="option active on">
                    <p>
                      You mined
                      <em class="target">#block382729273</em>
                    </p>
                    <span>
                      90.08734 e -
                      <em class="reward">Mining reward</em> •
                      <em class="time">few moments ago</em>
                    </span>
                  </div>

                  <div class="option off">
                    <p>
                      Ye277e…w7272
                      <em class="target">requested for</em> 100 ellies
                    </p>
                    <span>
                      Request
                      <em class="success">successful</em> | Testnet •
                      <em class="time">6 hours ago</em>
                    </span>
                  </div>

                  <div class="option checked">
                    <p>
                      You
                      <em class="target">sent</em> 49.09288
                      <em class="target">to</em> e387p…e9224
                    </p>
                    <span>
                      Transaction
                      <em class="success">successful</em> - Txn fee: 0.03932 •
                      <em class="time">7 hours ago</em>
                    </span>
                  </div>
                </div>
              </div>

              <div class="drop-down-footer">
                <a href="notification.html" class="view-notification">View all notifications</a>
              </div>
            </div>

            <!-- Notification Drop Down -->
          </div>
        </div>

        <div id="top-profile">
          <img src="../../assets/icon/profile.svg">
          <span class="address">e7p8Z...SkrTT</span>
        </div>

      <a id="create-account">
        <span>Create Account</span>
      </a>


      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';

export default {
	data() {
		return {
			openAccountDropdown: false,
		};
	},

	props: {
		accounts: Array,
	},

	created() {},

	mounted() {
		this.onEvents();
	},

	watch: {},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},
		onEvents() {
			const self: any = this;
			ipcRenderer.on(ChannelCodes.AppError, self.onAppErr);
		},

		createAccount() {
			ipcRenderer.send(ChannelCodes.AccountCreate);
		},
	},
};
</script>
