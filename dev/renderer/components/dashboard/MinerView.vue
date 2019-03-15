<template>
  <div id="mining-wrapper">
    <div class="statistics-content-wrapper statistics-with-image">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Miner (CPU)</span>
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
            <div class="data">
              <h1>
                <sub>{{mining.hashrate[0]}}</sub>
                <sup>{{mining.hashrate[1]}}</sup>
              </h1>
              <span>Mining Hashrate</span>
            </div>
          </div>



					<div class="statistic">
            <div class="data">
              <h1>
                <sub>{{ Intl.NumberFormat('en-UK').format(mining.diffInfo.curDifficulty) }}</sub>
              </h1>
              <span>
								Current Difficulty
								<strong
									class="text-warning"
									v-if="mining.diffIncreased && mining.pctDiffStr"
								>({{ mining.pctDiffStr }}%)</strong>
            </span>

						<em v-if="!mining.diffIncreased && mining.pctDiffStr">({{ mining.pctDiffStr }}%)</em>

            </div>
          </div>



					<div class="statistic">
            <div class="data">
              <h1>
                <sub>{{ mining.currentBlockNumber }}</sub>
              </h1>
              <span>Chain Height</span>
            </div>
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
            <strong>{{ this.averageBlockTime }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="notification success d-none">
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



        </div>
      </div>
    </div>


		<div class="footer">
      <button class="data-show-more" v-on:click="moreMinedBlocks" v-if="mining.minedBlocks.hasMore">Show More</button> 
    </div>


  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import ChannelCodes from '../../../core/channel_codes';
import { MinerStarted, MinerStopped } from '../constants/events';
import Mixin from './Mixin';
import BigNumber from 'bignumber.js';
import * as humanizeDur from 'humanize-duration';

export default {
	mixins: [Mixin],
	data() {
		return {
			averageBlockTime: 0,
			mining: {
				on: false,
				openSelect: false,
				minedBlocks: {
					blocks: [],
				},
				currentBlockNumber: '1',
				lastMinedBlockHash: '',
				hashrate: [],
				diffInfo: {},
				pctDiffStr: '',
				diffIncreased: false,
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

		// humanizeSeconds converts seconds to human-readable
		// string format
		humanizeSeconds(sec: any): string {
			return humanizeDur(sec * 1000, {
				units: ['s', 'd'],
			});
		},

		// onDataOverview is called when DataOverview event is fired.
		// It sets syncing, mining status and other basic information.
		// prettier-ignore
		onDataOverview(e, data) {
			this.mining.on = data.isMining;
			this.mining.hashrate = data.hashrate; // e.g [23, 'kH/s']
			this.mining.currentBlockNumber = data.currentBlockNumber;
			this.mining.diffInfo = data.diffInfo;
			this.averageBlockTime = this.humanizeSeconds(data.averageBlockTime);

			// Calculate percentage difference
			const pctDiff = this.percentageDiff(
				data.diffInfo.curDifficulty,
				data.diffInfo.prevDifficulty,
			);
			this.mining.diffIncreased = pctDiff.increase;
			if (pctDiff.diff === '0' && !pctDiff.increase) {
				this.mining.pctDiffStr = '';
			} else if (pctDiff.increase) {
				this.mining.pctDiffStr = '+' + new BigNumber(pctDiff.diff).toFixed(2);
			} else {
				this.mining.pctDiffStr ='-' + new BigNumber(pctDiff.diff).toFixed(2);
			}
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
