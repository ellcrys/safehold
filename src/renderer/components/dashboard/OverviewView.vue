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
            <h1>{{ currentBlockNumber }}</h1>
            <span>Current Block Number</span>
          </div>

          <div class="statistic">
            <h1>{{ numPeers }}</h1>
            <span>Connected peers</span>
            <em>(Inbound & Outbound)</em>
          </div>

          <div class="statistic">
            <h1>
              173,028.282
              <sup>&nbsp;ȅ</sup>
            </h1>
            <span>Total Amount</span>
            <em>(All Accounts)</em>
          </div>
        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">

          <div class="status">
            <p>Block sync:</p>

            <div class="select select-expand">
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
        </div>

        <div id="network-activity-navigation" class="data-activity-navigation">
          <ul>
            <li
              v-on:click="currentTab='mined_blocks'"
              v-bind:class="{active: currentTab == 'mined_blocks'}"
            >
              <span>Mined Blocks</span>
            </li>
            <li
              v-on:click="currentTab='connected_peers'"
              v-bind:class="{active: currentTab == 'connected_peers'}"
            >
              <span>Connected Peers ({{ connectedPeers.length }})</span>
            </li>

          </ul>
        </div>

        <div class="data-activity-main">
          <div
            v-if="!connectedPeers.length"
            class="no-content-notice text-muted"
          >Your node is not currenly connected to a peer. This will change shortly.</div>
          <table class="data-table" v-if="connectedPeers.length && currentTab == 'connected_peers'">
            <thead>
              <tr>
                <th>Peer Name</th>
                <th>Peer ID</th>
                <th>Direction</th>
                <th>Last Time Seen</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(peer) in connectedPeers" :key="peer.id">
                <td>{{ peer.name || "No Name" }}</td>
                <td>{{ shortenPeerID(peer.id) }}</td>
                <td>{{ (peer.isInbound) ? "Inbound": "Outbound" }}</td>
                <td>{{ rfc3339ToCalendarDate(peer.lastSeen) }}</td>
              </tr>
            </tbody>
            <tbody></tbody>
          </table>

          <table class="data-table" v-if="connectedPeers.length && currentTab == 'mined_blocks'">
            <thead>
              <tr>
                <th>BLOCK HASH</th>
                <th>HEIGHT</th>
                <th>TX COUNT</th>
                <th>FEES</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(mb) in minedBlocks.blocks" :key="mb.hash">
                <td>{{ mb.hash }}</td>
                <td>{{ parseInt(mb.number, 16) }}</td>
                <td>{{ mb.txCount }}</td>
                <td>{{ mb.totalFees }}</td>
                <td>{{ unixToCalendarDate(mb.timestamp) }}</td>
              </tr>
            </tbody>
            <tbody></tbody>
          </table>

          <div class="table-section-switcher d-none">
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
import Mixin from './Mixin';

export default {
	mixins: [Mixin],
	data() {
		return {
			currentBlockNumber: 1,
			isMining: false,
			isSyncing: false,
			numPeers: 0,
			connectedPeers: [],
			minedBlocks: [],
			currentTab: 'connected_peers',
		};
	},

	created() {
		this.onEvents();
		ipcRenderer.send(ChannelCodes.OverviewGet);
		ipcRenderer.send(ChannelCodes.GetConnectedPeers);
		// ipcRenderer.send(ChannelCodes.GetMinedBlocks);
	},

	watch: {},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
	},

	methods: {
		onAppErr(event, err) {},
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
			ipcRenderer.on(
				ChannelCodes.DataConnectedPeers,
				this.onDataConnectedPeers,
			);
			ipcRenderer.on(
				ChannelCodes.DataMinedBlocks,
				this.onDataMinedBlocks,
			);
		},

		onDataOverview(e, data) {
			this.currentBlockNumber = data.currentBlockNumber;
			this.isMining = data.isMining;
			this.isSyncing = data.isSyncing;
			this.numPeers = data.numPeers;
		},

		onDataMinedBlocks(e, minedBlocks) {
			this.minedBlocks = minedBlocks;
		},

		onDataConnectedPeers(e, peers: any[]) {
			this.connectedPeers = peers;
		},
	},
};
</script>
