const aesjs = require('aes-js');
/**
 * Encrypt a text using AES-CTR
 *
 * @export
 * @param {Buffer} key The
 * @param {string} text
 * @returns {Buffer} The binary
 */
export function encrypt(key, data) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const encBytes = aesCtr.encrypt(data);
    return Buffer.from(encBytes);
}
/**
 * Decrypt a piece of data expected
 * to have been encrypted using AES-CTR
 *
 * @export
 * @param {Buffer} key The encryption key
 * @param {Buffer} encData The encrypted binary data
 * @returns {Buffer}
 */
export function decrypt(key, encData) {
    const aesCtr = new aesjs.ModeOfOperation.ctr(key);
    const decData = aesCtr.decrypt(encData);
    return Buffer.from(decData);
}
//# sourceMappingURL=encrypt.js.map