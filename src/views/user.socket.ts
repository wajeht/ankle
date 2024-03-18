import { Socket } from 'socket.io';
import { onlineUsers as users } from '../db/db';

export function user(socket: Socket): void {
	socket.emit('user:online', users);
	socket.on('user:online', (id) => {
		if (!users.includes(id)) {
			users.push(id);
			console.log('user:online', id);
		}
		socket.broadcast.emit('user:online', users);
	});
}
