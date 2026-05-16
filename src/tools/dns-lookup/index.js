const dns = require('dns').promises;

exports.run = async function (type, domain) {
	domain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];

	if (type === 'A')     return (await dns.resolve4(domain)).join('\n');
	if (type === 'AAAA')  return (await dns.resolve6(domain)).join('\n');
	if (type === 'MX')    return (await dns.resolveMx(domain)).map(r => `${r.priority}\t${r.exchange}`).join('\n');
	if (type === 'NS')    return (await dns.resolveNs(domain)).join('\n');
	if (type === 'TXT')   return (await dns.resolveTxt(domain)).map(r => r.join(' ')).join('\n');
	if (type === 'CNAME') return (await dns.resolveCname(domain)).join('\n');
};