import {
	encrypt
} from '../../../../src/utilities/encrypt';
const crypto = require('crypto');

describe('Encrypt', () => {
	describe('.encrypt', () => {
		it('should render correct contents', () => {
			const key = crypto.randomBytes(16);
			const data = Buffer.from('ben', 'utf-8');
			encrypt()
		});
	});
});
