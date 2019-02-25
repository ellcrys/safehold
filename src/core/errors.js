export default {
    FailedToWriteWallet: {
        code: "failed_to_write_wallet",
        msg: "Unable to persist wallet to disk",
    },
    FailedToReadWallet: {
        code: "failed_to_read_wallet",
        msg: "Unable to read wallet from disk",
    },
    FailedToLoadWallet: {
        code: "failed_to_load_wallet",
        msg: "Unable to load default wallet from disk",
    },
};
export const ErrFailedToDecrypt = new Error("failed to decrypt");
//# sourceMappingURL=errors.js.map