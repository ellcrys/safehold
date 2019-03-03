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
    FailedToLoadElldObject: {
        code: "failed_to_load_elld_object",
        msg: "Failed to load Elld object",
    },
};
export const ErrFailedToDecrypt = new Error("failed to decrypt");
export const ErrIndexOutOfRange = Error("Index out of range");
//# sourceMappingURL=errors.js.map