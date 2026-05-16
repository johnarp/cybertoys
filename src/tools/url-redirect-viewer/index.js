const https = require('https');
const http = require('http');

function hop(url) {
	return new Promise((resolve, reject) => {
		const mod = url.startsWith('https') ? https : http;
		const req = mod.request(url, { method: 'HEAD' }, (res) => {
			resolve({ status: res.statusCode, location: res.headers.location || null });
		});
		req.on('error', reject);
		req.setTimeout(6000, () => { req.destroy(); reject(new Error('Timed out')); });
		req.end();
	});
}

exports.run = async function (_, url) {
	url = url.trim();
	if (!url.startsWith('http')) url = 'https://' + url;

	const chain = [];
	let current = url;
	const MAX = 10;

	while (chain.length < MAX) {
		let result;
		try {
			result = await hop(current);
		} catch (e) {
			chain.push(`ERROR  ${current}\n       ${e.message}`);
			break;
		}

		chain.push(`${result.status}  ${current}`);

		if (result.status >= 300 && result.status < 400 && result.location) {
			// Handle relative redirects
			let next = result.location;
			if (next.startsWith('/')) {
				const parsed = new URL(current);
				next = parsed.origin + next;
			}
			current = next;
		} else {
			break;
		}
	}

	if (chain.length >= MAX) chain.push('(stopped — too many hops)');

	return chain.join('\n');
};