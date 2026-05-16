const os = require('os');

exports.run = function () {
	let out = `Hostname:  ${os.hostname()}\n`;
	out += `Platform:  ${os.platform()} ${os.arch()}\n\n`;

	const ifaces = os.networkInterfaces();
	for (const [name, addrs] of Object.entries(ifaces)) {
		out += `${name}\n`;
		for (const a of addrs) {
			out += `  ${a.family.padEnd(6)}  ${a.address}`;
			if (a.mac && a.mac !== '00:00:00:00:00:00') out += `  (${a.mac})`;
			if (a.internal) out += '  [loopback]';
			out += '\n';
		}
	}

	return out;
};