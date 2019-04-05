<template>
  <div id="mining-wrapper">
    <div class="statistics-content-wrapper statistics-with-image">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Miner (CPU)</span>
        </div>

        <div class="statistics-button-set">
          <button
            class="popup-trigger btn-click-effect"
            @click="openSendModalTx()"
            data-target="send-from-wallet"
          >Send</button>
          <button
            class="popup-trigger btn-click-effect"
            @click="openReceiveAddress()"
            data-target="receive-to-wallet"
          >Receive</button>
        </div>
      </div>

      <div class="statistics-content-main">
        <div class="statistics-container no-highlight">
          <div class="statistic">
            <div class="data">
              <h1>
                <sub>{{mining.hashrate[0]}}</sub>
                <sup>{{mining.hashrate[1]}}</sup>
              </h1>
              <span>Miner Hashrate</span>
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
            <div class="select no-highlight select-dark">
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
          <div v-if="!mining.minedBlocks.blocks.length" class="no-content-notice text-muted">
            <img src="../../assets/img/emptyspace_connectedpeers.svg">
            <h1>No Activity</h1>
            <span>Your node is not currently connected to a peer.</span>
            <span>This will change shortly.</span>
          </div>

          <table class="data-table">
            <thead v-if="mining.minedBlocks.blocks.length >= 1">
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
                <td>
                  <a
                    v-on:click.prevent.stop=" openURI('https://ellscan.com/block/' + mb.hash)"
                  >{{ shortenBlockHash(mb.hash) }}</a>
                </td>
                <td>{{ parseInt(mb.number, 16) }}</td>
                <td>{{ mb.txCount }}</td>
                <td>{{ mb.totalFees }}</td>
                <td>{{ unixToCalendarDate(mb.timestamp) }}</td>
              </tr>

              <!--

									Sample version
								 <tr>
                <td><a v-on:click.prevent.stop="openEllScan('0xa09046714c3a3ebdd26a6d8dd5affa5d43272416845c388a9c6eccb4f0948102')">Block Hash</a></td>
                <td>height</td>
                <td>Tx count</td>
                <td>FEEs</td>
                <td>Timestamp</td>
              </tr>-->
            </tbody>
          </table>
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
import {
	MinerStarted,
	MinerStopped,
	ModalReceiveOpen,
	ModalSendOpen,
} from '../constants/events';
import Mixin from './Mixin';
import BigNumber from 'bignumber.js';
import * as humanizeDur from 'humanize-duration';
import { IOverviewData } from '../../../..';

// MaxMinedBlocksPerPage is the maximum number of
// mined blocks to request from the main process.
const MaxMinedBlocksPerPage = process.env.NODE_ENV === 'production' ? 25 : 3;

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

	// created is a lifecycle method of vue.
	// It reacts by:
	// - listening for events of interest
	created() {
		this.trackPage(this.$route.path);
		this.onEvents();
		ipcRenderer.send(ChannelCodes.OverviewGet);
		ipcRenderer.send(ChannelCodes.GetMinedBlocks, {
			limit: MaxMinedBlocksPerPage,
		});
	},

	// Remove events listeners
	// prettier-ignore
	beforeDestroy() {
		ipcRenderer.removeListener(ChannelCodes.AppError, this.onAppErr);
		ipcRenderer.removeListener(ChannelCodes.DataOverview,this.onDataOverview);
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
			ipcRenderer.on(ChannelCodes.DataMinedBlocks, this.onDataMinedBlocks);
			this.$bus.$on(MinerStarted, () => this.setMinerOn(true));
			this.$bus.$on(MinerStopped, () => this.setMinerOn(false));
		},

		// triggerMiner starts or stops the miner.
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

		// setMinerOn sets the active state of the miner
		setMinerOn(on: boolean) {
			this.mining.on = on;
		},

		// humanizeSeconds converts seconds to human-readable format
		humanizeSeconds(sec: number): string {
			return humanizeDur(sec * 1000, {
				units: ['s', 'd'],
			});
		},

		// onDataOverview is called when DataOverview event is received.
		// DataOverview is emitted from the main process and includes
		// basic information to be displayed on the overview pages.
		onDataOverview(e, data: IOverviewData) {
			this.mining.on = data.isMining;
			this.mining.hashrate = data.hashrate; // e.g [23, 'kH/s']
			this.mining.currentBlockNumber = data.currentBlockNumber;
			this.mining.diffInfo = data.diffInfo;
			this.averageBlockTime = this.humanizeSeconds(data.averageBlockTime);

			// Calculate percentage difference between
			// the current difficulty and the previous
			const pctDiff = this.percentageDiff(
				data.diffInfo.curDifficulty,
				data.diffInfo.prevDifficulty,
			);

			// Using the percent difference, determine the
			// appropriate miner percent difference label
			this.mining.diffIncreased = pctDiff.increase;
			if (pctDiff.diff === '0' && !pctDiff.increase) {
				this.mining.pctDiffStr = '';
			} else if (pctDiff.increase) {
				this.mining.pctDiffStr =
					'+' + new BigNumber(pctDiff.diff).toFixed(2);
			} else {
				this.mining.pctDiffStr =
					'-' + new BigNumber(pctDiff.diff).toFixed(2);
			}
		},

		// moreMinedBlocks fetches more mined blocks
		moreMinedBlocks() {
			ipcRenderer.send(ChannelCodes.GetMinedBlocks, {
				limit: MaxMinedBlocksPerPage,
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

		// openReceiveAddress is called when the `receive` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ReceiveTxn` modal to open.
		openReceiveAddress() {
			this.$bus.$emit(ModalReceiveOpen, {
				address: '',
				location: 'miner',
			});
		},

		// openSendModalTx is called when the `send` button
		// is triggered. It reacts by emitting a render-side event
		// instructing the `ModalSendOpen` modal to open.
		openSendModalTx() {
			this.$bus.$emit(ModalSendOpen, {
				address: '',
				location: 'miner',
			});
		},
	},
};
</script>
