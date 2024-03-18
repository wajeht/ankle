import fs from 'fs/promises';
import marked from 'marked';
import path from 'path';
// @ts-ignore
import express, { Request, Response, NextFunction } from 'express';
import { db } from '../db/db';
import { getIPAddress } from '../utils/utils';

const routes = express.Router();

routes.get('/healthz', (req: Request, res: Response) => {
	const message = 'ok';

	if (req.get('Content-Type') === 'application/json') {
		return res.status(200).json({ message });
	}

	return res.status(200).send(message);
});

routes.get('/guest-book', async (req: Request, res: Response, next: NextFunction) => {
	try {
		// prettier-ignore
		const emojis = [
			'🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🦘',
			'🦡', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉',
			'🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦢',
			'🦉', '🦚', '🦜', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛',
			'🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦗', '🕷️', '🕸️',
			'🦂', '🦟', '🦠', '🐢', '🐍', '🦎', '🐙', '🦑', '🦞', '🦀',
			'🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
			'🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘',
			'🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐',
			'🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🪶', '🐓', '🦃',
			'🦤', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡',
			'🦦', '🦫', '🦭', '🦮', '🦧'
		];

		const users = (
			await db.user.findMany({
				orderBy: {
					created_at: 'desc',
				},
			})
		).map((user: any) => ({
			...user,
			emoji: emojis[Math.floor(Math.random() * emojis.length)],
			// prettier-ignore
			created_at: user.created_at.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + user.created_at.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', }),
		}));

		return res.render('guest-book.html', {
			title: 'guest book',
			path: req.path,
			users,
			flashMessages: req.flash(),
		});
	} catch (error) {
		next(error);
	}
});

routes.post('/guest-book', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.body.name || !req.body.message) {
			req.flash('error', '🚨⚠️‼️ name or message must not be empty ‼️⚠️🚨');
			return res.redirect('/guest-book');
		}

		await db.user.create({
			data: {
				name: req.body.name,
				message: req.body.message,
			},
		});
		req.flash('success', '🎉 🥳 Thank you for signing my guest book! 🙏');
		return res.redirect('/guest-book?success=true');
	} catch (error) {
		next(error);
	}
});

routes.get('/gallery', (req: Request, res: Response) => {
	return res.render('gallery.html', { title: 'gallery', path: req.path });
});

routes.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ip = await getIPAddress();

		await db.count.create({ data: { ip } });

		const [{ count }] = await db.$queryRaw`SELECT COUNT(*) AS count FROM counts`;

		const files = await fs.readdir(path.resolve(path.join(process.cwd(), 'src', 'posts')));
		const posts = files
			.filter((file) => file.endsWith('.md'))
			.map((file) => ({
				title: path.basename(file, '.md'),
				file,
			}))
			.reverse();
		return res.render('home.html', { title: 'ankle.jaw.dev', path: req.path, posts, count });
	} catch (err) {
		next(err);
	}
});

routes.get('/posts/:post', async (req: Request, res: Response, next: NextFunction) => {
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
	const error = process.env.NODE_ENV === 'production' ? 'oh no, something went wrong!' : err;
	return res.status(500).render('error.html', { title: 'Error', path: req.path, error });
}

export { routes };
