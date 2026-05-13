const crypto = require('node:crypto');

exports.run = function (option, input) {
	return crypto.createHash(option).update(input).digest('hex');
};