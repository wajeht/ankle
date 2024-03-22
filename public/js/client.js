document.addEventListener('DOMContentLoaded', async (event) => {
	console.log(`


          JJJJJJJJJJJ               AAA               WWWWWWWW                           WWWWWWWW
          J:::::::::J              A:::A              W::::::W                           W::::::W
          J:::::::::J             A:::::A             W::::::W                           W::::::W
          JJ:::::::JJ            A:::::::A            W::::::W                           W::::::W
	        J:::::J             A:::::::::A            W:::::W           WWWWW           W:::::W
	        J:::::J            A:::::A:::::A            W:::::W         W:::::W         W:::::W
	        J:::::J           A:::::A A:::::A            W:::::W       W:::::::W       W:::::W
	        J:::::j          A:::::A   A:::::A            W:::::W     W:::::::::W     W:::::W
	        J:::::J         A:::::A     A:::::A            W:::::W   W:::::W:::::W   W:::::W
JJJJJJJ     J:::::J        A:::::AAAAAAAAA:::::A            W:::::W W:::::W W:::::W W:::::W
J:::::J     J:::::J       A:::::::::::::::::::::A            W:::::W:::::W   W:::::W:::::W
J::::::J   J::::::J      A:::::AAAAAAAAAAAAA:::::A            W:::::::::W     W:::::::::W
J:::::::JJJ:::::::J     A:::::A             A:::::A            W:::::::W       W:::::::W
 JJ:::::::::::::JJ     A:::::A               A:::::A            W:::::W         W:::::W
   JJ:::::::::JJ      A:::::A                 A:::::A            W:::W           W:::W
     JJJJJJJJJ       AAAAAAA                   AAAAAAA            WWW             WWW


	`);
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

	// websocket stuff
	window.socket.on('connect', () => {
		// console.log('socket connected!');
		window.socket.emit('user:online', socket.id);
	});

	window.socket.on('user:online', (users) => {
		// console.log('user:online', users);
		window.users = users || [];
		if (document.getElementById('user-online')) {
			document.getElementById('user-online').innerText = users.length;
		}
	});

	window.socket.on('disconnect', () => {
		// console.log('socket disconnected!');
		window.users = window.users.filter(u => u !== window.socket.id);
		if (document.getElementById('user-online')) {
			document.getElementById('user-online').innerText = window.users.length;
		}
	});
});
