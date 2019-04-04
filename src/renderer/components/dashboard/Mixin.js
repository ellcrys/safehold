export default {
    methods: {
        /**
         * Get a shortened version of a given
         * address
         *
         * @param {string} addr
         * @returns
         */
        addressToShort(addr) {
            const addrLen = addr.length;
            return (addr.substr(0, 5) + "..." + addr.substr(addrLen - 5, addrLen));
        },
    },
};
//# sourceMappingURL=Mixin.js.map