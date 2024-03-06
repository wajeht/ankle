import fs from 'fs/promises';
import marked from 'marked';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).send('ok');
});

routes.get('/guest-book', (req, res) => {
	return res.render('guest-book.html', { title: 'guest book', path: req.path });
});

routes.get('/gallery', (req, res) => {
	return res.render('gallery.html', { title: 'gallery', path: req.path });
});

routes.get('/', async (req, res, next) => {
	try {
		const files = await fs.readdir(path.resolve(path.join(process.cwd(), 'src', 'posts')));
		const posts = files
			.filter((file) => file.endsWith('.md'))
			.map((file) => ({
				title: path.basename(file, '.md'),
				file,
			}))
			.reverse();
		return res.render('posts.html', { title: 'ankle.jaw.dev', path: req.path, posts });
	} catch (err) {
		next(err);
	}
});

routes.get('/posts/:post', async (req, res, next) => {
	try {
		const postPath = path.resolve(
			path.join(process.cwd(), 'src', 'posts', `${req.params.post}.md`),
		);
		const data = await fs.readFile(postPath, 'utf8');
		return res.render('post.html', {
			title: req.params.post,
			post: marked.marked(data),
			layout: '../layouts/post.html',
			path: req.path,
		});
	} catch (err) {
		next(err);
	}
});

export function localVariables(req: Request, res: Response, next: NextFunction) {
	res.locals.app = {
		env: process.env.NODE_ENV,
		title: 'ankle.jaw.dev',
		headerText: '🩼 Broken Ankle',
		description: 'my broken ankle journey',
		copyRightYear: new Date().getFullYear(),
	};
	next();
}

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
	return res.status(404).render('not-found.html', { title: 'Not found', path: req.path });
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	return res.status(500).render('error.html', { title: 'Error', path: req.path });
}

export { routes };
