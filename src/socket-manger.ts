import { Server as SocketIOServer, Socket } from 'socket.io';
import { user } from './views/user.socket';
import { onlineUsers as users } from './db/db';

const connectedSockets: Set<Socket> = new Set();

export function setupSocketHandlers(io: SocketIOServer): void {
	// @ts-ignore
	global.io = io;

	io.on('connection', (socket: Socket) => {
		console.log('socket connected', socket.id);

		connectedSockets.add(socket);

		user(socket);

		socket.on('disconnect', () => {
			console.log('socket disconnected', socket.id);
			connectedSockets.delete(socket);

			// delete user sockets from online users db
			const index = users.findIndex((u: any) => u === socket.id);
			if (index !== -1) {
				users.splice(index, 1);
			}

			socket.broadcast.emit('user:online', users);
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
