<template>
  <div id="mining-wrapper">
    <div class="statistics-content-wrapper statistics-with-image">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Mining</span>
        </div>

        <div class="statistics-button-set">
          <button class="popup-trigger" data-target="import-private-key-wrapper">Import key</button>
          <button class="popup-trigger" data-target="send-from-wallet">Send</button>
          <button class="popup-trigger" data-target="receive-to-wallet">Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container">
          <div class="statistic">
            <h1>
              {{mining.hashrate[0]}}
              <sup>{{mining.hashrate[1]}}</sup>
            </h1>
            <span>Miner Hashrate</span>
          </div>

          <div class="statistic">
            <h1>{{ Intl.NumberFormat('en-UK').format(mining.diffInfo.curDifficulty) }}</h1>
            <span>Current Block dificulty (
              <strong>+23.4%</strong>)
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
            <p>Mining status:</p>
            <div class="select">
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
          <div class="status">
            <p>Average block time:</p>
            <strong>72 seconds</strong>
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
        </div>

        <div class="data-activity-navigation">
          <ul>
            <li class="active">
              <span>My Mined Blocks</span>
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
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(mb) in mining.minedBlocks.blocks" :key="mb.hash">
                <td>{{ mb.hash }}</td>
                <td>{{ parseInt(mb.number, 16) }}</td>
                <td>{{ mb.txCount }}</td>
                <td>{{ mb.totalFees }}</td>
                <td>{{ unixToCalendarDate(mb.timestamp) }}</td>
              </tr>
            </tbody>
          </table>

          <span v-on:click="moreMinedBlocks" v-if="mining.minedBlocks.hasMore">More</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import { MinerStarted, MinerStopped } from '../constants/events';
import Mixin from './Mixin';

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
				hashrate: [],
				diffInfo: {},
			},
		};
	},

	created() {
		this.onEvents();
	},

	mounted() {
		ipcRenderer.send(ChannelCodes.OverviewGet);
		ipcRenderer.send(ChannelCodes.GetMinedBlocks, { limit: 3 });
	},

	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(
			ChannelCodes.DataOverview,
			this.onDataOverview,
		);
	},

	methods: {
		onAppErr(event, err) {},
		onEvents() {
			ipcRenderer.on(ChannelCodes.AppError, this.onAppErr);
			ipcRenderer.on(ChannelCodes.DataOverview, this.onDataOverview);
			ipcRenderer.on(
				ChannelCodes.DataMinedBlocks,
				this.onDataMinedBlocks,
			);
			this.$bus.$on(MinerStarted, () => this.toggleMiner(true));
			this.$bus.$on(MinerStopped, () => this.toggleMiner(false));
		},

		// triggerMiner starts or stops the miner
		triggerMiner() {
			this.mining.openSelect = !this.mining.openSelect;
			if (!this.mining.on) {
				this.$bus.$emit(MinerStarted);
				return ipcRenderer.send(ChannelCodes.MinerStart);
			}
			this.$bus.$emit(MinerStopped);
			ipcRenderer.send(ChannelCodes.MinerStop);
		},

		// toggleMiner sets the active state of the miner
		toggleMiner(on: boolean) {
			this.mining.on = on;
		},

		// onDataOverview is called when DataOverview event is fired.
		// It sets syncing, mining status and other basic information.
		onDataOverview(e, data) {
			this.mining.on = data.isMining;
			this.mining.hashrate = data.hashrate; // e.g [23, 'kH/s']
			this.mining.diffInfo = data.diffInfo;
		},

		// moreMinedBlocks fetches more mined blocks
		moreMinedBlocks() {
			ipcRenderer.send(ChannelCodes.GetMinedBlocks, {
				limit: 3,
				lastHash: this.mining.lastMinedBlockHash,
			});
		},

		// onDataMinedBlocks is called when mined blocks are received.
		// Usually called after GetMinedBlocks was fired.
		onDataMinedBlocks(e, minedBlocks) {
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
	},
};
</script>
