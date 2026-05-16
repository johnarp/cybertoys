exports.run = function (option, input) {
	if (option === 'encode') return encodeURIComponent(input);
	if (option === 'decode') return decodeURIComponent(input);
};