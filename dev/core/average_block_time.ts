import Spell from "@ellcrys/spell";

export default class AverageBlockTime {
	/**
	 * Calculate the average block time
	 * of the network.
	 *
	 * @static
	 * @param {Spell} spell A spell instance querying the node
	 * @returns
	 * @memberof AverageBlockTime
	 */
	public static calculate(spell: Spell): Promise<number> {
		return new Promise(async (resolve, reject) => {
			// Get the current tip
			const tip = await spell.state.getBlock(0);
			const tipNumber = parseInt(tip.header.number, 16);
			const timeSet = [];

			// Get a max of 50 blocks before the tip.
			let nextBlockNum = tipNumber - 1;
			for (let i = 0; i < 49; i++) {
				try {
					const b = await spell.state.getBlock(nextBlockNum);
					timeSet.push(parseInt(b.header.timestamp, 16));
				} catch (err) {
					if (!err.message.match(/.*block not found.*/)) {
						return reject(err);
					}
				}
				nextBlockNum--;
				if (nextBlockNum === 0) {
					break;
				}
			}

			// Get the sum of differences between
			// the time set items.
			let timespanSum = 0;
			for (let i = 0; i < timeSet.length; i++) {
				const cur = timeSet[i];
				if (i + 1 === timeSet.length) {
					continue;
				}
				const next = timeSet[i + 1];
				timespanSum += cur - next;
			}
			return resolve(Math.ceil(timespanSum / timeSet.length));
		});
	}
}
