import { app } from './app';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { disconnectSockets, setupSocketHandlers } from './socket-manger';

const PORT = process.env.PORT || 8080;

const server: http.Server = http.createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
	cors: {
		credentials: true,
		origin: true,
	},
});

server.listen(PORT, async () => {
	try {
		setupSocketHandlers(io);
		console.log(`Server was started on http://localhost:${PORT}`);
	} catch (error) {
		console.log('An error occurred during server start ', error);
		process.exit(1);
	}
});

export async function gracefulShutdown() {
	console.log('Initiating graceful shutdown.');

	let isShutdownCompleted = false;

	const shutdownProcess = async () => {
		try {
			disconnectSockets();
			console.log('Successfully closed all connections.');
			isShutdownCompleted = true;
			process.exit(0);
		} catch (err) {
			console.error('Shutdown error:', err);
			process.exit(1);
		}
	};

	server.close((err) => {
		if (err) {
			console.error('Error closing the server:', err);
			process.exit(1);
		} else {
			shutdownProcess();
		}
	});

	setTimeout(() => {
		if (!isShutdownCompleted) {
			console.error('Timeout: Forcefully shutting down.');
			process.exit(1);
		}
	}, 60000); // 60 seconds
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
