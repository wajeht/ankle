export async function getIPAddress() {
	try {
		const response = await fetch('https://ip.jaw.dev');
		const data = await response.text();
		return data.trim();
	} catch (error) {
		console.error('Error fetching IP address:', error);
		throw error;
	}
}

export const logger = {
	debug: (...value: any) => {
		if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
			const timestamp = new Date().toLocaleString();
			console.log(`\x1b[33m 🐛 ${timestamp} ${value}\x1b[0m`);
		}
	},
	error: (...value: any) => {
		const timestamp = new Date().toLocaleString();
		console.log(`\x1b[31m ❌ ${timestamp} ${value}\x1b[0m`);
	},
	info: (...value: any) => {
		const timestamp = new Date().toLocaleString();
		console.log(`\x1b[32m ℹ️  ${timestamp} ${value}️\x1b[0m`);
	},
};
