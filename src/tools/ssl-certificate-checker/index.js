const tls = require('tls');

exports.run = async function (_, input) {
	let host = input.trim().replace(/^https?:\/\//, '').split('/')[0];
	const port = 443;

	return new Promise((resolve) => {
		const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: false }, () => {
			const cert = socket.getPeerCertificate(true);
			socket.destroy();

			if (!cert || !cert.subject) {
				resolve('No certificate found.');
				return;
			}

			const now = new Date();
			const validFrom = new Date(cert.valid_from);
			const validTo = new Date(cert.valid_to);
			const daysLeft = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
			const isValid = socket.authorized || true;
			const isExpired = now > validTo;
			const expiringSoon = daysLeft <= 30 && !isExpired;

			let out = `Host:    ${host}\n`;
			out += `Status:  ${isExpired ? '✗ EXPIRED' : expiringSoon ? '⚠ Expiring soon' : '✓ Valid'}\n\n`;

			out += `--- Certificate ---\n`;
			out += `Subject: ${cert.subject?.CN || 'N/A'}\n`;
			out += `Issuer:  ${cert.issuer?.O || cert.issuer?.CN || 'N/A'}\n`;
			out += `Valid from: ${validFrom.toDateString()}\n`;
			out += `Valid to:   ${validTo.toDateString()}\n`;
			out += `Days left:  ${isExpired ? 'EXPIRED' : daysLeft}\n`;

			// SANs (Subject Alternative Names)
			if (cert.subjectaltname) {
				const sans = cert.subjectaltname
					.split(', ')
					.map(s => s.replace('DNS:', '').trim());
				out += `\n--- SANs (${sans.length}) ---\n`;
				out += sans.join('\n');
			}

			resolve(out);
		});

		socket.on('error', (e) => resolve(`Error: ${e.message}`));
		socket.setTimeout(8000, () => {
			socket.destroy();
			resolve('Error: Connection timed out');
		});
	});
};