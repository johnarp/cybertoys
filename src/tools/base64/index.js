exports.run = function (option, input) {
	if (option === 'encode') return Buffer.from(input).toString('base64');
	if (option === 'decode') return Buffer.from(input, 'base64').toString('utf-8');
};