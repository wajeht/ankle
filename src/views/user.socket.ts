import { Socket } from 'socket.io';

let users: string[] = [];

export function user(socket: Socket): void {
	socket.emit('user:online', users);

	socket.on('user:online', (id) => {
		if (!users.includes(id)) users.push(id);
		socket.broadcast.emit('user:online', users);
	});

	socket.on('disconnect', () => {
		users = users.filter((u) => u !== socket.id);
		socket.broadcast.emit('user:online', users);
	});
}
