document.addEventListener('DOMContentLoaded', async (event) => {
	// particlejs
	particlesJS.load('particles-js', '/js/particlesjs-config.json', function() {
  	// console.log('callback - particles.js config loaded');
	});

	// https://codepen.io/incompl/pen/DQOdLv
	window.addEventListener(
		'mousemove',
		function (e) {
			[1, 0.9, 0.8, 0.5, 0.1].forEach(function (i) {
				var j = (1 - i) * 50;
				var elem = document.createElement('div');
				var size = Math.ceil(Math.random() * 10 * i) + 'px';
				elem.style.position = 'fixed';
				elem.style.top = e.pageY + Math.round(Math.random() * j - j / 2) + 'px';
				elem.style.left = e.pageX + Math.round(Math.random() * j - j / 2) + 'px';
				elem.style.width = size;
				elem.style.height = size;
				elem.style.background =
					'hsla(' + Math.round(Math.random() * 360) + ', ' + '100%, ' + '50%, ' + i + ')';
				elem.style.borderRadius = size;
				elem.style.pointerEvents = 'none';
				document.body.appendChild(elem);
				window.setTimeout(
					function () {
						document.body.removeChild(elem);
					},
					Math.round(Math.random() * i * 500),
				);
			});
		},
		false,
	);


	// web sockets
	const socket = io('/');
	window.socket = socket;

	socket.on('connect', () => {
		// console.log('socket connected!');
		socket.emit('user:online', socket.id);
	});

	socket.on('user:online', (users) => {
			// console.log('Online users:', users);
			window.users = users || [];
			document.getElementById('user-online').innerText = users.length;
	});

	socket.on('disconnect', () => {
		// console.log('socket disconnected!');
			document.getElementById('user-online').innerText = window.users.length;
	});
});
