import { Socket } from 'socket.io';
import { onlineUsers as users } from '../db/db';

export function user(socket: Socket): void {
	socket.emit('user:online', users);

	socket.on('user:online', (id) => {
		if (!users.includes(id)) {
			users.push(id);
		}
		socket.broadcast.emit('user:online', users);
	});

	socket.on('disconnect', () => {
		const index = users.indexOf(socket.id);
		if (index !== -1) {
			users.splice(index, 1);
			socket.broadcast.emit('user:online', users);
		}
	});
}
