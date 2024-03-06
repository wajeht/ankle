import fs from 'fs/promises';
import marked from 'marked';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';

const routes = express.Router();

routes.get('/healthz', (req, res) => {
	return res.status(200).send('ok');
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
		return res.render('posts.html', { title: 'ankle.jaw.dev', posts });
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
			content: marked.marked(data),
			layout: '../layouts/post.html',
		});
	} catch (err) {
		next(err);
	}
});

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
	return res.status(404).render('not-found.html', { title: 'Not found' });
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	return res.status(500).render('error.html', { title: 'Error' });
}

export { routes };
