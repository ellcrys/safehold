<template>
  <div id="account-wrapper">
    <div class="statistics-content-wrapper statistics-background-blue">
      <div class="statistics-content-header">

        <div class="statistics-account">
          <strong>Account 1</strong>
          <span>e7p8ZGtP4fZYB4J2bqnQMjesxftZLSkrTT</span>
          <button></button>
        </div>

        <div class="statistics-button-set">
          <button class="popup-trigger" data-target="import-private-key-wrapper">Import key</button>
          <button class="popup-trigger" data-target="send-from-wallet">Send txn</button>
          <button class="popup-trigger" data-target="receive-to-wallet">Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container" id="">
          <div class="statistic">
            <img src="../../assets/icon/noun-account-2065955.svg">
            <div class="data">
              <h1>
                <sub>282.883</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Account Balance</span>
              <em>(e7p8Z...SkrTT)</em>
            </div>

          </div>





          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-2.svg">
            <div class="data">
              <h1>
                <sub>0.00</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total transaction sent</span>
            
            </div>

          </div>



          <div class="statistic">
            <img src="../../assets/icon/combined-shape-copy-2-3.svg">
            <div class="data">
              <h1>
                <sub>282.883</sub>
                <sup>ȅ</sup>
              </h1>
              <span>Total transaction received</span>
         
            </div>

          </div>


        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">
          <div class="status">
            <p>Block sync:</p>
            <span>Syncing</span>
          </div>

          <div class="status">
            <p>Mining status:</p>
            <span>Starting...</span>
          </div>

          <div class="status">
            <em>New</em>
            <p>Ellscan —</p>
            <strong>Ellcrys Official Block Explorer</strong>
            <p>&nbsp;&nbsp;| Ellscan.com&nbsp;&nbsp;</p>
          </div>
        </div>
      </div>
    </div>

    <div class="table-data-wrapper">
      <div class="data-activity-log">
        <div class="data-activity-header">
          <h3>Account Transactions</h3>

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
            <li>
              <span>All</span>
            </li>
            <li class="active">
              <span>Sent</span>
            </li>
            <li>
              <span>Received</span>
            </li>
          </ul>
        </div>

        <div class="data-activity-main">
          <table class="data-table">
            <thead>
              <tr>
                <th>TX Hash</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              <tr class="active">
                <td>0xe22...cc39a</td>
                <td>e7p8Z...SkrTT</td>
                <td>e122xZ...ptrGQ</td>
                <td>283,000.00832</td>
                <td>Dec-21-2018 05:04:25 PM + UTC</td>
              </tr>

              <tr>
                <td>0xe22...cc39a</td>
                <td>e7p8Z...SkrTT</td>
                <td>e122xZ...ptrGQ</td>
                <td>283,000.00832</td>
                <td>Dec-21-2018 05:04:25 PM + UTC</td>
              </tr>

              <tr>
                <td>0xe22...cc39a</td>
                <td>e7p8Z...SkrTT</td>
                <td>e122xZ...ptrGQ</td>
                <td>283,000.00832</td>
                <td>Dec-21-2018 05:04:25 PM + UTC</td>
              </tr>

              <tr>
                <td>0xe22...cc39a</td>
                <td>e7p8Z...SkrTT</td>
                <td>e122xZ...ptrGQ</td>
                <td>283,000.00832</td>
                <td>Dec-21-2018 05:04:25 PM + UTC</td>
              </tr>
            </tbody>
            <tbody></tbody>
          </table>


        </div>
      </div>
    </div>



    <div class="footer">
      <button class="data-show-more">Show More</button> 
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
		},
	},
};
</script>
