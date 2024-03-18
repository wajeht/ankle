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
