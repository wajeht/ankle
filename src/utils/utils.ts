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
	debug: (value: any) => {
		if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
			const timestamp = new Date().toLocaleString();
			console.log(`${timestamp} ***** ${value} *****`);
		}
	},
};
