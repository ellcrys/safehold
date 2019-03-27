const aesjs = require("aes-js");
import * as scrypt from "scrypt";
export function encrypt(key, data) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const encBytes = aesCtr.encrypt(data);
    return Buffer.from(encBytes);
}
export function decrypt(key, encData) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const decData = aesCtr.decrypt(encData);
    return Buffer.from(decData);
}
export function kdf(data, outLen = 64, salt = "") {
    return scrypt.hashSync(data, { N: 32768, r: 8, p: 1 }, outLen, salt);
}
