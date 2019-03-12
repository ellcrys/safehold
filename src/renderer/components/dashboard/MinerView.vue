<template>
  <div id="mining-wrapper">
    <div class="statistics-content-wrapper statistics-with-image">
      <div class="statistics-content-header">
        <div class="statistics-filter">
          <span>Mining</span>
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
            <div class="roller roller-orange">
              <svg viewBox="0 0 36 36">
                <!-- <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="circle" stroke-dasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <text x="18" y="20.35" class="percentage">80%</text> -->


                <path
                  class="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <path
                  class="circle"
                  stroke-dasharray="30 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                ></path>
                <text x="18" y="20.35" class="percentage">30%</text>
              </svg>
            </div>

            <p>Block syncing in progress</p>
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
import { MinerStarted, MinerStopped } from '../constants/events';

export default {
	data() {
		return {
			mining: {
				on: false,
				openSelect: false,
			},
		};
	},

	created() {
		this.onEvents();
	},

	mounted() {
		ipcRenderer.send(ChannelCodes.OverviewGet);
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
		},
	},
};
</script>
