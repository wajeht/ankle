import { Server as SocketIOServer, Socket } from 'socket.io';
import { user } from './views/user.socket';

const connectedSockets: Set<Socket> = new Set();

export function setupSocketHandlers(io: SocketIOServer): void {
	io.on('connection', (socket: Socket) => {
		console.log('socket connected', socket.id);

		connectedSockets.add(socket);

		user(socket);

		socket.on('disconnect', () => {
			console.log('socket disconnected', socket.id);
			connectedSockets.delete(socket);
		});
	});
}

export function disconnectSockets(): void {
	console.log('disconnecting sockets');

	for (const socket of connectedSockets) {
		socket.disconnect(true);
	}

	connectedSockets.clear();
	console.log('all sockets have been disconnected');
}
