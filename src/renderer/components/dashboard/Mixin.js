import BigNumber from "bignumber.js";
import * as jdenticon from "jdenticon";
import * as moment from "moment";
import * as svgToDataURL from "svg-to-dataurl";
// prettier-ignore
export const ErrBadAddressLen = new Error("expected address to have 34 characters");
// prettier-ignore
export const ErrBadPeerIDLen = new Error("expected peer id to have 52 characters");
// prettier-ignore
export const ErrBadBlockHashLen = new Error("expected block hash length of 66 characters");
export default {
    methods: {
        /**
         * Get a shortened version of a given
         * address
         *
         * @param {string} addr
         * @throws ErrBadAddressLen when address length is less than 34
         * @returns
         */
        shortenAddress(addr) {
            const addrLen = addr.length;
            if (addrLen < 34) {
                throw ErrBadAddressLen;
            }
            return (addr.substr(0, 5) + "..." + addr.substr(addrLen - 5, addrLen));
        },
        /**
         * Get the shortened version of a node ID
         *
         * @param {string} id
         * @returns
         */
        shortenPeerID(id) {
            const idLen = id.length;
            if (idLen !== 52) {
                throw ErrBadPeerIDLen;
            }
            return id.substr(0, 10) + "..." + id.substr(idLen - 10, idLen);
        },
        /**
         * Get the shortened version of a block hash.
         *
         * @param {string} hash
         * @returns
         */
        shortenBlockHash(hash) {
            const len = hash.length;
            if (len !== 66) {
                throw ErrBadBlockHashLen;
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
        /**
         * Create avatars
         *
         * @param {*} hash
         * @param {number} [size=100]
         * @returns
         */
        makeAvatar(hash, size = 40) {
            return svgToDataURL(jdenticon.toSvg(hash, size));
        },
        /**
         * Calculate the percentage difference
         * between
         *
         * @param {string|BigNumber} newNum The new number
         * @param {string|BigNumber} oldNum The old number
         * @returns {{ diff: string; increase: boolean }}
         */
        percentageDiff(newNum, oldNum) {
            const newNumBig = new BigNumber(newNum);
            const oldNumBig = new BigNumber(oldNum);
            if (newNumBig.eq(oldNumBig)) {
                return { diff: "0", increase: false };
            }
            else if (newNumBig.comparedTo(oldNumBig) > 0) {
                const inc = newNumBig.minus(oldNumBig);
                return {
                    increase: true,
                    diff: inc
                        .div(oldNumBig)
                        .times(100)
                        .toString(),
                };
            }
            else {
                const dec = oldNumBig.minus(newNumBig);
                return {
                    increase: false,
                    diff: dec
                        .div(oldNumBig)
                        .times(100)
                        .toString(),
                };
            }
        },
    },
};
