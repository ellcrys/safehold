<template>
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
