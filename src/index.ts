import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import expressLayouts from 'express-ejs-layouts';
import marked from 'marked';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			'default-src': ["'self'", 'plausible.jaw.dev'],
			'script-src': ["'self'", "'unsafe-inline'", 'plausible.jaw.dev'],
		},
	}),
);

app.use(cors());
app.use(compression());
app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '24h' }));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'views', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'views', 'layouts', 'main.html')));
app.use(expressLayouts);

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.get('/', (req: Request, res: Response) => {
	fs.readdir(path.resolve(path.join(process.cwd(), 'src', 'posts')), (err, files) => {
		if (err) return res.status(500).send('Failed to load posts.');
		const posts = files
			.filter((file) => file.endsWith('.md'))
			.map((file) => {
				const title = path.basename(file, '.md');
				return { title, file };
			});

		res.render('posts.html', { title: 'posts', posts });
	});
});

app.get('/:post', (req: Request, res: Response) => {
	const postPath = path.resolve(path.join(process.cwd(), 'src', 'posts', `${req.params.post}.md`));
	fs.readFile(postPath, 'utf8', (err, data) => {
		if (err) return res.status(404).send('Post not found!');
		return res.render('post.html', { title: req.params.post, content: marked.marked(data) });
	});
});

app.use((req: Request, res: Response, _next: NextFunction) => res.status(404).send('not found'));

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
	res.status(500).send('error'),
);

const server = app.listen(PORT, () => {
	console.log(`Server was started on http://localhost:${PORT}`);
});

function gracefulShutdown() {
	console.log('Received kill signal, shutting down gracefully.');
	server.close(() => {
		console.log('HTTP server closed.');
		process.exit(0);
	});
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at: ', promise, ' reason: ', reason);
});

export { app };
