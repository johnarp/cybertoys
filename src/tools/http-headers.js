const https = require('https');
const http = require('http');

// Headers that should be present (their absence is a finding)
const SHOULD_EXIST = {
	'strict-transport-security':  'Enforces HTTPS (HSTS)',
	'content-security-policy':    'Reduces XSS attack surface (CSP)',
	'x-frame-options':            'Prevents clickjacking',
	'x-content-type-options':     'Prevents MIME-type sniffing',
	'referrer-policy':            'Controls referrer information leakage',
	'permissions-policy':         'Restricts access to browser features',
};

// Headers that should NOT be present (their presence is a finding)
const SHOULD_NOT_EXIST = {
	'x-powered-by': 'Exposes server technology — remove it',
	'server':        'Exposes server software — consider removing or obscuring',
};

exports.run = async function (_, url) {
	url = url.trim();
	if (!url.startsWith('http')) url = 'https://' + url;

	return new Promise((resolve, reject) => {
		const mod = url.startsWith('https') ? https : http;

		const req = mod.request(url, { method: 'HEAD' }, (res) => {
			const h = res.headers;
			let out = `Status: ${res.statusCode} ${res.statusMessage}\n`;
			out += `URL:    ${url}\n`;
			out += '\n--- Security Audit ---\n';

			for (const [header, note] of Object.entries(SHOULD_EXIST)) {
				if (h[header]) {
					out += `✓  ${header}\n   ${h[header]}\n`;
				} else {
					out += `✗  ${header} MISSING\n   → ${note}\n`;
				}
			}

			for (const [header, note] of Object.entries(SHOULD_NOT_EXIST)) {
				if (h[header]) {
					out += `⚠  ${header}: ${h[header]}\n   → ${note}\n`;
				}
			}

			out += '\n--- All Headers ---\n';
			for (const [k, v] of Object.entries(h)) {
				out += `${k}: ${v}\n`;
			}

			resolve(out);
		});

		req.on('error', reject);
		req.setTimeout(8000, () => { req.destroy(); reject(new Error('Request timed out')); });
		req.end();
	});
};