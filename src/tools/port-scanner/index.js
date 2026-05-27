const net = require('net');

// Common ports and their service names
const SERVICES = {
	21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
	80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 445: 'SMB',
	3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 6379: 'Redis',
	8080: 'HTTP-Alt', 8443: 'HTTPS-Alt', 27017: 'MongoDB',
};

function scanPort(host, port, timeout = 2000) {
	return new Promise((resolve) => {
		const socket = new net.Socket();
		socket.setTimeout(timeout);

		socket.on('connect', () => {
			socket.destroy();
			resolve({ port, open: true });
		});

		socket.on('timeout', () => {
			socket.destroy();
			resolve({ port, open: false });
		});

		socket.on('error', () => {
			resolve({ port, open: false });
		});

		socket.connect(port, host);
	});
}

function parsePorts(input) {
	const ports = new Set();

	for (const part of input.split(',')) {
		const trimmed = part.trim();
		if (trimmed.includes('-')) {
			const [start, end] = trimmed.split('-').map(Number);
			if (!isNaN(start) && !isNaN(end)) {
				for (let p = start; p <= Math.min(end, 65535); p++) ports.add(p);
			}
		} else {
			const p = Number(trimmed);
			if (!isNaN(p) && p > 0 && p <= 65535) ports.add(p);
		}
	}

	return [...ports];
}

exports.run = async function (_, input) {
	// input format: "host|ports" e.g. "192.168.1.1|22,80,443" or "google.com|1-1024"
	const [host, portStr] = input.split('|');

	if (!host || !portStr) return 'Format: host|ports  (e.g. google.com|80,443 or 192.168.1.1|1-1024)';

	const ports = parsePorts(portStr);
	if (ports.length === 0) return 'No valid ports specified.';
	if (ports.length > 5000) return 'Too many ports — limit to 5000 at a time.';

	const clean = host.trim().replace(/^https?:\/\//, '').split('/')[0];

	// Scan in batches of 100 concurrent connections
	const BATCH = 100;
	const open = [];

	for (let i = 0; i < ports.length; i += BATCH) {
		const batch = ports.slice(i, i + BATCH);
		const results = await Promise.all(batch.map(p => scanPort(clean, p)));
		results.filter(r => r.open).forEach(r => open.push(r.port));
	}

	if (open.length === 0) return `No open ports found on ${clean}.`;

	let out = `Host: ${clean}\nOpen ports: ${open.length}\n\n`;
	for (const port of open.sort((a, b) => a - b)) {
		const service = SERVICES[port] ? `  (${SERVICES[port]})` : '';
		out += `${String(port).padEnd(6)}${service}\n`;
	}

	return out;
};