<template>
  <div id="container">
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
              <img id="notification-trigger" src="../assets/icon/notification_inactive.svg">

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
            <img src="../assets/icon/profile.svg">
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

    <div id="main">
      <div id="side-navigation-wrapper" class="shift-content-top-mobile">
        <img id="logo" src="../assets/img/logo.svg">

        <img id="logo-small" src="../assets/img/logo-small.svg">

        <div id="miner-engine-switch-wrapper">
          <div class="shift-content-top">
            <div class="switch">
              <button class id="miner-switch"></button>
              <p data-on-msg="Miner ON" data-off-msg="Miner OFF" class>Miner OFF</p>
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
              <img src="../assets/icon/icon-home.svg">
              <strong>
                <a href="overview.html">Overview</a>
              </strong>
            </div>
          </div>

          <div class="nav" id="account-nav">
            <div class="shift-content">
              <img src="../assets/icon/icon-customization.svg">
              <strong>
                <a>Accounts</a>
              </strong>
              <span>10</span>

              <div class="sub-nav-wrapper">
                <a href="account.html" class="sub-nav">
                  <img src="../assets/icon/img-20170731-113126.svg">
                  <em>e7p8Z...SkrTT</em>
                </a>

                <a href="account.html" class="sub-nav">
                  <img src="../assets/icon/img-20170731-113126.svg">
                  <em>eKsEX...Fwn3g</em>
                </a>

                <a href="account.html" class="sub-nav">
                  <img src="../assets/icon/img-20170731-113126.svg">
                  <em>eGFi9...TUCxp</em>
                </a>

                <button id="see-more">See more</button>
              </div>
            </div>
          </div>

          <div class="nav">
            <div class="shift-content">
              <img src="../assets/icon/icon-real-time.svg">
              <strong>
                <a href="mining.html">Mining</a>
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
              <img src="../assets/icon/icon-audience.svg">
              <strong>
                <a href="exportwallet.html">Export Wallets</a>
              </strong>
            </div>
          </div>

          <div class="nav">
            <div class="shift-content">
              <img src="../assets/icon/icon-acquisition-copy.svg">
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

      <!-- Content Wrapper Main Comienza -->
      <div class="content-wrapper-main" id="content-wrapper-main">
        <div id="mining-wrapper">
          <div class="statistics-content-wrapper statistics-with-image">
            <div class="statistics-content-header">
              <div class="statistics-select-account">
                <select>
                  <option selected>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</option>
                  <option></option>
                </select>
              </div>

              <div class="statistics-button-set">
                <button class="popup-trigger" data-target="import-private-key-wrapper">Import key</button>
                <button class="popup-trigger" data-target="send-from-wallet">Send txn</button>
                <button class="popup-trigger" data-target="receive-to-wallet">Receive</button>
              </div>
            </div>

            <div class="statistics-content-main">
              <div class="statistics-container">
                <div class="statistic">
                  <h1>
                    282.883
                    <sup>kH/s</sup>
                  </h1>
                  <span>Mining Hashrate</span>
                  <em>(Mon - 13th Nov, 2019)</em>
                </div>

                <div class="statistic">
                  <h1>2,603,077.027</h1>
                  <span>
                    <strong>+23.4%</strong>, Current block dificulty
                  </span>
                  <em>-</em>
                </div>

                <div class="statistic">
                  <h1>183,992</h1>
                  <span>Current block number</span>
                  <em>-</em>
                </div>
              </div>
            </div>

            <div class="statistics-content-footer">
              <div class="statistics-mining-status">
                <div class="status">
                  <p>Average block time:</p>
                  <strong>72 seconds</strong>
                </div>

                <div class="status">
                  <p>Block sync:</p>
                  <span>Syncing</span>
                </div>

                <div class="status">
                  <p>Mining status:</p>
                  <span>Starting...</span>
                </div>

                <div class="status">
                  <p>Block syning in progress</p>
                </div>
              </div>
            </div>
          </div>

          <div class="notification success">
            <span>You successfully transfered 399 ELL to e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
          </div>

          <div class="table-data-wrapper">
            <div class="data-activity-log">
              <div class="data-activity-header">
                <h3>Mining Activity</h3>

                <ul>
                  <span>Filter by:</span>
                  <li class="active">All time</li>
                  <li>Last 24 hrs</li>
                  <li>Last 3 days</li>
                  <li>Last 1 week</li>
                </ul>
              </div>

              <div class="data-activity-navigation">
                <ul>
                  <li class="active">
                    <span>My Mined Blocks</span>
                  </li>
                  <li class>
                    <span>All blocks</span>
                  </li>
                </ul>
              </div>

              <div class="data-activity-main">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Block Hash</th>
                      <th>height</th>
                      <th>Tx count</th>
                      <th>FEEs</th>
                      <th class="active">Reward</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>0xe22...cc39a</td>
                      <td>2,488</td>
                      <td>2</td>
                      <td>0.0284 ȅ</td>
                      <td>283.00832 ȅ</td>
                      <td>Dec-21-2018 05:04:25 PM + UTC</td>
                    </tr>

                    <tr>
                      <td>0xe22...cc39a</td>
                      <td>2,488</td>
                      <td>2</td>
                      <td>0.0284 ȅ</td>
                      <td>283.00832 ȅ</td>
                      <td>Dec-21-2018 05:04:25 PM + UTC</td>
                    </tr>

                    <tr>
                      <td>0xe22...cc39a</td>
                      <td>2,488</td>
                      <td>2</td>
                      <td>0.0284 ȅ</td>
                      <td>283.00832 ȅ</td>
                      <td>Dec-21-2018 05:04:25 PM + UTC</td>
                    </tr>

                    <tr>
                      <td>0xe22...cc39a</td>
                      <td>2,488</td>
                      <td>2</td>
                      <td>0.0284 ȅ</td>
                      <td>283.00832 ȅ</td>
                      <td>Dec-21-2018 05:04:25 PM + UTC</td>
                    </tr>
                  </tbody>
                  <tbody></tbody>
                </table>

                <div class="table-section-switcher">
                  <button class="prev"></button>

                  <div class="btn-group">
                    <button class="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button class="more"></button>
                    <button>37</button>
                    <button>38</button>
                    <button>39</button>
                    <button>40</button>
                  </div>

                  <button class="next"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Wrapper Main Extremos -->
      <!-- Content Wrapper Extremos -->
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../core/channel_codes';

export default {
	data() {
		return {};
	},

	created() {
		this.onEvents();
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
	},
};
</script>
