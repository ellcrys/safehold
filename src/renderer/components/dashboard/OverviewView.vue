<template>
  <div id="overview-wrapper">
    <div class="statistics-content-wrapper statistics-background-blue">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Overview</span>
        </div>

        <div class="statistics-button-set">
          <button @click="openSendModalTx()" class="popup-trigger">Send</button>
          <button @click="openReceiveAddress()" class="popup-trigger">Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container no-highlight">
          <div class="statistic">
            <div class="data">
              <h1>
                <sub>{{ currentBlockNumber }}</sub>
              </h1>
              <span>Chain Height</span>
              <em>(Main Chain)</em>
            </div>
          </div>

          <div class="statistic">
            <div class="data">
              <h1>
                <sub>{{ numPeers }}</sub>
              </h1>
              <span>Connected Peers</span>
              <em>(Inbound & Outbound)</em>
            </div>
          </div>

          <div class="statistic">
            <div class="data">
              <h1>
                <sub>{{ formatMoney(totalAccountsBalance) }}</sub>
              </h1>
              <span>Total Balance</span>
              <em>(All Accounts)</em>
            </div>
          </div>
        </div>
      </div>

      <div class="statistics-content-footer">
        <div class="statistics-mining-status">
          <div class="status">
            <p>Sync Status:</p>

            <div class="select no-highlight">
              <span
                v-if="syncing.isSyncing && syncing.isSyncEnabled"
                v-on:click="syncing.openSelect = !syncing.openSelect"
                class="orange"
              >Syncing</span>
              <span
                v-if="!syncing.isSyncing && syncing.isSyncEnabled"
                v-on:click="syncing.openSelect = !syncing.openSelect"
                class="green"
              >Synced</span>
              <span
                v-if="!syncing.isSyncEnabled"
                v-on:click="syncing.openSelect = !syncing.openSelect"
                class="gray"
              >Disabled</span>
              <ul v-if="syncing.openSelect">
                <li class="red" v-if="syncing.isSyncEnabled" v-on:click="toggleSyncSwitch">Disable</li>
                <li class="green" v-if="!syncing.isSyncEnabled" v-on:click="toggleSyncSwitch">Enable</li>
              </ul>
            </div>
          </div>

          <div class="status">
            <p>Mining Status:</p>

            <div class="select no-highlight">
              <span
                class="green"
                v-on:click="mining.openSelect = !mining.openSelect"
                v-if="mining.on"
              >On</span>
              <span
                class="gray"
                v-on:click="mining.openSelect = !mining.openSelect"
                v-if="!mining.on"
              >Off</span>
              <ul class v-if="mining.openSelect">
                <li class="green" v-on:click="triggerMiner" v-if="!mining.on">On</li>
                <li class="gray" v-on:click="triggerMiner" v-if="mining.on">Off</li>
              </ul>
            </div>
          </div>

          <!-- <div class="status active">
            <p>Mining status:</p>
            <span>Active</span>
          </div>-->
          <div class="status">
            <em>New</em>
            <p>Ellscan —</p>
            <strong>Ellcrys Official Block Explorer</strong>
            <p>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="https://ellscan.com">Ellscan.com</a>
            </p>
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
              v-on:click="currentTab='connected_peers'"
              v-bind:class="{active: currentTab == 'connected_peers'}"
            >
              <span>Connected Peers ({{ connectedPeers.length }})</span>
            </li>
            <li
              v-on:click="currentTab='mined_blocks'"
              v-bind:class="{active: currentTab == 'mined_blocks'}"
            >
              <span>My Mined Blocks</span>
            </li>
          </ul>
        </div>

        <div class="data-activity-main">
          <div v-if="currentTab == 'connected_peers'">
            <div v-if="!connectedPeers.length" class="no-content-notice text-muted">
              <img src="../../assets/img/emptyspace_connectedpeers.svg">
              <h1>No Activity</h1>
              <span>Your node is not currently connected to a peer.</span>
              <span>This will change shortly.</span>
            </div>
            <table
              class="data-table"
              v-if="connectedPeers.length && currentTab == 'connected_peers'"
            >
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
          </div>
          <div v-if="currentTab == 'mined_blocks'">
            <div
              v-if="!mining.minedBlocks.blocks.length"
              class="no-content-notice text-muted"
            >Your node has not mined any block yet.</div>
            <table
              class="data-table"
              v-if="mining.minedBlocks.blocks.length && currentTab == 'mined_blocks'"
            >
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
                <tr v-for="(mb) in mining.minedBlocks.blocks" :key="mb.hash">
                  <td>{{ shortenBlockHash(mb.hash) }}</td>
                  <td>{{ parseInt(mb.number, 16) }}</td>
                  <td>{{ mb.txCount }}</td>
                  <td>{{ mb.totalFees }}</td>
                  <td>{{ unixToCalendarDate(mb.timestamp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <button
        class="data-show-more"
        v-on:click="moreMinedBlocks"
        v-if="mining.minedBlocks.hasMore"
      >Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import Mixin from './Mixin';
import {
	MinerStarted,
	MinerStopped,
	TopAlertOpen,
	ModalReceiveOpen,
	ModalSendOpen,
} from '../constants/events';
import { IOverviewData, IActivePeer } from '../../../..';
import { MinedBlocksResult } from '@ellcrys/spell';

// MaxMinedBlocksPerPage is the maximum number of
// mined blocks to request from the main process.
const MaxMinedBlocksPerPage = 3;

export default {
	mixins: [Mixin],
	data() {
		return {
			mining: {
				on: false,
				openSelect: false,
				minedBlocks: {
					blocks: [],
				},
				lastMinedBlockHash: '',
			},
			syncing: {
				openSelect: false,
				isSyncing: false,
				isSyncEnabled: false,
			},
			currentBlockNumber: 1,
			numPeers: 0,
			connectedPeers: [],
			currentTab: 'connected_peers',
			totalAccountsBalance: 0,
		};
	},

	// created is a lifecycle method of vue.
	created() {
		// listen for events of interest
		this.onEvents();
		// Fire OverviewGet to request for overview information from the main process
		ipcRenderer.send(ChannelCodes.OverviewGet);
		// Fire GetConnectedPeers to request for a list of connected peers from the main process
		ipcRenderer.send(ChannelCodes.GetConnectedPeers);
		// Fire GetMinedBlocks to request for a list of mined blocks from the main process
		ipcRenderer.send(ChannelCodes.GetMinedBlocks, {
			limit: MaxMinedBlocksPerPage,
		});
	},

	mounted() {
		// Detech whether we just recently performed
		// a wallet restoration operation
		if (this.$route.query && this.$route.query.restorationDone) {
			this.$bus.$emit(TopAlertOpen, 'Wallet Restoration Completed');
		}
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataOverview, this.onDataOverview);
		ipcRenderer.removeListener(ChannelCodes.DataConnectedPeers, this.onDataConnectedPeers);
		ipcRenderer.removeListener(ChannelCodes.DataMinedBlocks, this.onDataMinedBlocks);
	},

	methods: {
		// onAppErr is called when an error happens
		// as a result of an action on the main process
		onAppErr(event, err) {},

		// onEvents is where subscriptions for various
		// events are made.
		// prettier-ignore
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
			ipcRenderer.on(ChannelCodes.DataConnectedPeers, this.onDataConnectedPeers);
			ipcRenderer.on(ChannelCodes.DataMinedBlocks, this.onDataMinedBlocks);
			this.$bus.$on(MinerStarted, () => this.toggleMiner(true));
			this.$bus.$on(MinerStopped, () => this.toggleMiner(false));
		},

		// toggleMiner sets the active state of the miner to
		// on (true) or off (false)
		toggleMiner(on: boolean) {
			this.mining.on = on;
		},

		// triggerMiner is called when the miner select option is triggered.
		// It sets the mining status and emits a render-side event
		// MinerStarted to inform other components of the mining status.
		// More importantly, it emits a MinerStart/MinerStop event
		// which will cause the main process to start or stop the miner.
		triggerMiner() {
			this.mining.openSelect = !this.mining.openSelect;
			if (!this.mining.on) {
				this.$bus.$emit(MinerStarted);
				return ipcRenderer.send(ChannelCodes.MinerStart);
			}
			this.$bus.$emit(MinerStopped);
			ipcRenderer.send(ChannelCodes.MinerStop);
		},

		// toggleSyncSwitch enables or disables block
		// synchronization. It emits SyncEnable or
		// SyncDisable to the main process.
		toggleSyncSwitch() {
			this.syncing.openSelect = !this.syncing.openSelect;
			if (!this.syncing.isSyncEnabled) {
				return ipcRenderer.send(ChannelCodes.SyncEnable);
			}
			ipcRenderer.send(ChannelCodes.SyncDisable);
		},

		// onDataOverview is called when DataOverview event is received.
		// DataOverview is emitted from the main process and includes
		// basic information to be displayed on the overview pages.
		onDataOverview(e, data: IOverviewData) {
			this.currentBlockNumber = data.currentBlockNumber;
			this.numPeers = data.numPeers;
			this.syncing.isSyncing = data.isSyncing;
			this.syncing.isSyncEnabled = data.isSyncEnabled;
			this.mining.on = data.isMining;
			this.totalAccountsBalance = data.totalAccountsBalance;
		},

		// onDataMinedBlocks is called when mined blocks are received.
		// Usually called after GetMinedBlocks was fired.
		onDataMinedBlocks(e, minedBlocks: MinedBlocksResult) {
			const newMinedBlocks = minedBlocks.blocks;
			const hasMore = minedBlocks.hasMore;
			this.mining.minedBlocks.blocks = this.mining.minedBlocks.blocks.concat(
				newMinedBlocks,
			);
			this.mining.minedBlocks.hasMore = hasMore;

			// If we have more mined blocks, we need
			// to get the last block's hash so we can
			// use it to set the starting point next
			// time we query for more.
			if (this.mining.minedBlocks.hasMore) {
				const blocks = this.mining.minedBlocks.blocks;
				const lastBlockInd = this.mining.minedBlocks.blocks.length - 1;
				if (this.mining.lastMinedBlockHash) {
					this.mining.prevMinedBlockHash = this.mining.lastMinedBlockHash;
				}
				this.mining.lastMinedBlockHash = blocks[lastBlockInd].hash;
			}
		},

		// moreMinedBlocks requests more mined blocks
		// by emitting GetMinedBlocks to the main process.
		moreMinedBlocks() {
			ipcRenderer.send(ChannelCodes.GetMinedBlocks, {
				limit: MaxMinedBlocksPerPage,
				lastHash: this.mining.lastMinedBlockHash,
			});
		},

		// onDataConnectedPeers is called when request for
		// connected peers is received.
		onDataConnectedPeers(e, peers: IActivePeer[]) {
			this.connectedPeers = peers;
		},

		// openReceiveAddress is called when the `receive` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ReceiveTxn` modal to open.
		openReceiveAddress() {
			this.$bus.$emit(ModalReceiveOpen, { address: '' });
		},

		// openSendModalTx is called when the `send` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ModalSendOpen` modal to open.
		openSendModalTx() {
			this.$bus.$emit(ModalSendOpen, { address: '' });
		},
	},
};
</script>
