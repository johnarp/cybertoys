const crypto = require('node:crypto');

exports.run = function () {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+';
	const bytes = crypto.randomBytes(20);
	return Array.from(bytes).map(b => chars[b % chars.length]).join('');
};