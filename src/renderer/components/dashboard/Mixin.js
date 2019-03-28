import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-identicon-sprites";
import BigNumber from "bignumber.js";
import Decimal from "decimal.js";
import * as moment from "moment";
import * as numeral from "numeral";
import * as svgToDataURL from "svg-to-dataurl";
export const ErrBadAddressLen = new Error("expected address to have 34 characters");
export const ErrBadPeerIDLen = new Error("expected peer id to have 52 characters");
export const ErrBadBlockHashLen = new Error("expected block hash length of 66 characters");
export const ErrBadTxHashLen = new Error("expected transaction hash length of 66 characters");
export default {
    methods: {
        shortenAddress(addr) {
            const addrLen = addr.length;
            if (addrLen < 34) {
                throw ErrBadAddressLen;
            }
            return (addr.substr(0, 5) + "..." + addr.substr(addrLen - 5, addrLen));
        },
        shortenPeerID(id) {
            const idLen = id.length;
            if (idLen !== 52) {
                throw ErrBadPeerIDLen;
            }
            return id.substr(0, 10) + "..." + id.substr(idLen - 10, idLen);
        },
        shortenBlockHash(hash) {
            const len = hash.length;
            if (len !== 66) {
                throw ErrBadBlockHashLen;
            }
            return hash.substr(0, 15) + "..." + hash.substr(len - 15, len);
        },
        shortenTxHash(hash) {
            const len = hash.length;
            if (len !== 66) {
                throw ErrBadTxHashLen;
            }
            return hash.substr(0, 10) + "..." + hash.substr(len - 10, len);
        },
        isBlockHash(str) {
            return (str.toLocaleLowerCase().substr(0, 2) === "0x" &&
                str.length === 66);
        },
        isTxHash(str) {
            return (str.toLocaleLowerCase().substr(0, 2) === "0x" &&
                str.length === 66);
        },
        unixToCalendarDate(unix) {
            return moment.unix(unix).calendar();
        },
        rfc3339ToCalendarDate(date) {
            return moment(date).calendar();
        },
        makeAvatar(hash, size = 40) {
            const options = {};
            const avatars = new Avatars(sprites(options));
            const svg = avatars.create(hash);
            return svgToDataURL(svg);
        },
        toFixed(num, decPlaces) {
            return new Decimal(num).toFixed(decPlaces);
        },
        formatMoney(num) {
            return numeral(num).format("0,0.00");
        },
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
