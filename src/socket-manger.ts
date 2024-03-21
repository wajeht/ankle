import { Server as SocketIOServer, Socket } from 'socket.io';
import { user } from './views/user.socket';
import { logger } from './utils/utils';

const connectedSockets: Set<Socket> = new Set();

export function setupSocketHandlers(io: SocketIOServer): void {
	io.on('connection', (socket: Socket) => {
		logger.info('socket connected', socket.id);

		connectedSockets.add(socket);

		user(socket);

		socket.on('disconnect', () => {
			logger.info('socket disconnected', socket.id);
			connectedSockets.delete(socket);
		});
	});
}

export function disconnectSockets(): void {
	logger.info('disconnecting sockets');

	for (const socket of connectedSockets) {
		socket.disconnect(true);
	}

	connectedSockets.clear();
	logger.info('all sockets have been disconnected');
}
