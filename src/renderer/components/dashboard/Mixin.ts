import * as moment from "moment";

export default {
	methods: {
		/**
		 * Get a shortened version of a given
		 * address
		 *
		 * @param {string} addr
		 * @returns
		 */
		shortenAddress(addr: string) {
			const addrLen = addr.length;
			return (
				addr.substr(0, 5) + "..." + addr.substr(addrLen - 5, addrLen)
			);
		},

		/**
		 * Get the shortened version of a node ID
		 *
		 * @param {string} id
		 * @returns
		 */
		shortenPeerID(id: string) {
			const idLen = id.length;
			if (idLen !== 52) {
				throw new Error("Invalid peer id");
			}
			return id.substr(0, 10) + "..." + id.substr(idLen - 10, idLen);
		},

		/**
		 * Get the shortened version of a block hash
		 *
		 * @param {string} hash
		 * @returns
		 */
		shortenBlockHash(hash: string) {
			const len = hash.length;
			if (len !== 66) {
				throw new Error("Invalid block hash");
			}
			return hash.substr(0, 15) + "..." + hash.substr(len - 15, len);
		},

		/**
		 * Convert unix timestamp to calendar time
		 *
		 * @param {*} unix
		 * @returns
		 */
		unixToCalendarDate(unix) {
			return moment.unix(unix).calendar();
		},

		/**
		 * Convert a date in rfc3339 format to
		 * calendar time
		 *
		 * @param {*} date
		 * @returns
		 */
		rfc3339ToCalendarDate(date) {
			return moment(date).calendar();
		},
	},
};
