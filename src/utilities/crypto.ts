const aesjs = require('aes-js');
import * as scrypt from 'scrypt';

/**
 * Encrypt a text using AES-CTR
 *
 * @export
 * @param {Buffer} key The
 * @param {string} text
 * @returns {Buffer} The binary
 */
export function encrypt(key: Buffer, data: Buffer): Buffer {
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
export function decrypt(key: Buffer, encData: Buffer): Buffer {
	const aesCtr = new aesjs.ModeOfOperation.ctr(key);
	const decData = aesCtr.decrypt(encData);
	return Buffer.from(decData);
}


/**
 * Generate a KDF digest using scrypt
 *
 * @export
 * @param {string} data The data to harden
 * @param {number} [outLen=64] The length of the output
 * @param {string} [salt=''] The salt to use for output uniqueness
 * @returns {Buffer}
 */
export function kdf(data: string, outLen = 64, salt = ''): Buffer {
	return scrypt.hashSync(
		data,
		{ N: 32768, r: 8, p: 1 },
		outLen,
		salt,
	);
}
