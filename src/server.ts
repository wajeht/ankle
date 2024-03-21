import { app } from './app';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { disconnectSockets, setupSocketHandlers } from './socket-manger';
import { logger } from './utils/utils';

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
		logger.info(`Server was started on http://localhost:${PORT}`);
	} catch (error) {
		logger.info('An error occurred during server start ', error);
		process.exit(1);
	}
});

export async function gracefulShutdown() {
	logger.info('Initiating graceful shutdown.');

	let isShutdownCompleted = false;

	const shutdownProcess = async () => {
		try {
			disconnectSockets();
			logger.info('Successfully closed all connections.');
			isShutdownCompleted = true;
			process.exit(0);
		} catch (err) {
			logger.info('Shutdown error:', err);
			process.exit(1);
		}
	};

	server.close((err) => {
		if (err) {
			logger.info('Error closing the server:', err);
			process.exit(1);
		} else {
			shutdownProcess();
		}
	});

	setTimeout(() => {
		if (!isShutdownCompleted) {
			logger.info('Timeout: Forcefully shutting down.');
			process.exit(1);
		}
	}, 60000); // 60 seconds
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
	logger.info('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
