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

          <!-- Account Drop Down -->
          <div class="drop-down hide" id="account-drop-down">
            <div class="drop-down-header">
              <h1>Accounts</h1>
            </div>

            <div class="drop-down-main">
              <div class="drop-down-main-options drop-down-image-padding">
                <div class="option active">
                  <strong>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</strong>
                  <div>
                    <span>Default Account address</span>
                    <button class="set-default"></button>
                  </div>
                </div>

                <div class="option">
                  <strong>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</strong>
                  <div>
                    <span>Account address</span>
                    <button class="set-default">Set as Default</button>
                  </div>
                </div>

                <div class="option">
                  <strong>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</strong>
                  <div>
                    <span>Account address</span>
                    <button class="set-default">Set as Default</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="drop-down-footer">
              <button class="create-account" data-target="new-account-wrapper">Create New Account</button>
              <button class="sign-out">Sign out - e7p8z…krTT</button>
            </div>
          </div>
          <!-- Account Drop Down -->
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';

export default {
	data() {
		return {};
	},

	mounted() {
		this.onEvents();
		// setTimeout(() => {
		// 	this.createAccount();
		// }, 3000);
	},

	watch: {},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
		},

		createAccount() {
			ipcRenderer.send(ChannelCodes.AccountCreate);
		},
	},
};
</script>
