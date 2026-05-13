// All CyberToys tools - add new tools here
module.exports = [
	{
		id: 'base64',
		name: 'Base64',
		category: 'Encoding',
		hotkey: 'CommandOrControl+Shift+B',
		description: 'Encode or decode Base64 strings.',
	},
	{
		id: 'url',
		name: 'URL Encode',
		category: 'Encoding',
		hotkey: 'CommandOrControl+Shift+U',
		description: 'URL-encode or decode strings.',
	},
	{
		id: 'hash',
		name: 'Hash Generator',
		category: 'Hashing',
		hotkey: 'CommandOrControl+Shift+H',
		description: 'Generate a hash from text.',
	},
	{
		id: 'dns',
		name: 'DNS Lookup',
		category: 'Network',
		hotkey: 'CommandOrControl+Shift+D',
		description: 'Resolve a domain to its IP addresses and DNS records.',
	},
	{
		id: 'http-headers',
		name: 'HTTP Header Analyzer',
		category: 'Web',
		hotkey: 'CommandOrControl+Shift+A',
		description: 'Fetch and run a security audit on HTTP headers from any URL.',
	},
	{
		id: 'netinfo',
		name: 'Network Info',
		category: 'Network',
		hotkey: 'CommandOrControl+Shift+N',
		description: 'Show local network interfaces, IPs, and MAC addresses.',
	},
	{
		id: 'password',
		name: 'Password Analyzer',
		category: 'Passwords',
		hotkey: 'CommandOrControl+Shift+P',
		description: 'Analyze password strength and check against known breaches via HIBP.',
	},
	{
		id: 'url-redirect',
		name: 'URL Redirect Viewer',
		category: 'Web',
		hotkey: 'CommandOrControl+Shift+R',
		description: 'Follow a URL through its full redirect chain.',
	},
];