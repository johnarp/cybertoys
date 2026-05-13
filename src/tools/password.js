const crypto = require('node:crypto');
const https = require('https');

function analyze(password) {
	const checks = [];

	if (password.length >= 16)     checks.push('✓ Length ≥ 16');
	else if (password.length >= 12) checks.push('~ Length ≥ 12 (16+ recommended)');
	else                            checks.push(`✗ Length: ${password.length} (too short)`);

	if (/[A-Z]/.test(password)) checks.push('✓ Uppercase');
	else                         checks.push('✗ No uppercase letters');

	if (/[a-z]/.test(password)) checks.push('✓ Lowercase');
	else                         checks.push('✗ No lowercase letters');

	if (/[0-9]/.test(password))  checks.push('✓ Numbers');
	else                          checks.push('✗ No numbers');

	if (/[^A-Za-z0-9]/.test(password)) checks.push('✓ Special characters');
	else                                 checks.push('✗ No special characters');

	const score = checks.filter(c => c.startsWith('✓')).length;
	const rating = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][Math.min(score, 4)];

	return { rating, checks };
}

function hibp(password) {
	const hash   = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
	const prefix = hash.slice(0, 5);
	const suffix = hash.slice(5);

	return new Promise((resolve) => {
		https.get(`https://api.pwnedpasswords.com/range/${prefix}`, (res) => {
			let data = '';
			res.on('data', c => data += c);
			res.on('end', () => {
				const match = data.split('\n').find(l => l.startsWith(suffix));
				if (match) {
					const count = parseInt(match.split(':')[1]).toLocaleString();
					resolve(`⚠  Found in ${count} known breaches`);
				} else {
					resolve('✓  Not found in known breaches');
				}
			});
		}).on('error', () => resolve('?  Could not reach HIBP'));
	});
}

function generate() {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+';
	const bytes = crypto.randomBytes(20);
	return Array.from(bytes).map(b => chars[b % chars.length]).join('');
}

exports.run = async function (mode, input) {
	if (mode === 'generate') {
		return generate();
	}

	// analyze
	const { rating, checks } = analyze(input);
	let out = `Strength: ${rating}\n\n${checks.join('\n')}\n\n`;
	out += await hibp(input);
	return out;
};