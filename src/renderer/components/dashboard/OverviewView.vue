<template>
  <div id="overview-wrapper">
    <div class="statistics-content-wrapper statistics-background-blue">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Dashboard</span>
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
            <h1>28,377</h1>
            <span>Current block number</span>
          </div>

          <div class="statistic">
            <h1>272</h1>
            <span>Connected peers</span>
            <em>(inbound and outbound)</em>
          </div>

          <div class="statistic">
            <h1>173,028.282
              <sup>&nbsp;ȅ</sup>
            </h1>
            <span>Total amount held in the</span>
            <span>wallet - All accounts</span>
          </div>
        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">

          <div class="status">
            <p>Block sync:</p>

            <div class="select">
              <span class="green">Synched</span>
              <ul class="">
                <li class="gray">Not Synching</li>
                <li class="green">Start Synching</li>
                <li class="orange">Synching</li>
                <li class="green">Synched</li>
                <li class="red">Stop</li>
                <li class="green">On</li>
                <li class="red">Off</li>
              </ul>
            </div>

          </div>



          <div class="status">
            <p>Mining status:</p>

            <div class="select">
              <span class="green">Synched</span>
              <ul class="">
                <li class="gray">Not Synching</li>
                <li class="green">Start</li>
  
              </ul>
            </div>


          </div>

          <!-- <div class="status active">
            <p>Mining status:</p>
            <span>Active</span>
          </div> -->

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
          <h3>Network Activity Log</h3>

          <ul>
            <span>Filter by:</span>
            <li class="active">All time</li>
            <li>Last 24 hrs</li>
            <li>Last 3 days</li>
            <li>Last 1 week</li>
          </ul>
        </div>

        <div id="network-activity-navigation" class="data-activity-navigation">
          <ul>

            <li>
              <span>My Blocks</span>
            </li>

            <li class="active">
              <span>Connected Peers (2183)</span>
            </li>

          </ul>
        </div>

        <div class="data-activity-main">
          <table class="data-table">
            <thead>
              <tr>
                <th>Peer Name</th>
                <th>Peer Address</th>
                <th>Last Time Seen</th>
              </tr>
            </thead>

            <tbody>
              <tr class="active">
                <td>HotFlame</td>
                <td>172.022.001.002</td>
                <td>Dec-21-2018 05:04:25 PM + UTC</td>
              </tr>

              <tr>
                <td>JadeXCombo</td>
                <td>194.953.275.367</td>
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
