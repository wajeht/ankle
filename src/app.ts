import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import flash from 'connect-flash';
import RedisStore from 'connect-redis';
import ejs from 'ejs';
import path from 'path';
// @ts-ignore
import express, { Request, Response } from 'express';
import expressLayouts from 'express-ejs-layouts';
import { errorHandler, localVariables, notFoundHandler, routes } from './views/routes';
import { rateLimit } from 'express-rate-limit';
import { redis } from './db/db';

const redisStore = new RedisStore({
	client: redis,
	prefix: 'ankle-session-store:',
});

const app = express();

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
		standardHeaders: 'draft-7',
		legacyHeaders: false,
		skip: async function (req, _res) {
			const myIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(', ')[0];
			const myIpWasConnected = myIp === process.env.MY_IP;
			return myIpWasConnected || process.env.NODE_ENV !== 'production';
		},
		message: (req: Request, res: Response) => {
			if (req.get('Content-Type') === 'application/json') {
				return res.status(429).json({ message: 'Too many requests, please try again later?' });
			}
			return res.status(429).render('./rate-limit.html');
		},
	}),
);
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				'default-src': ["'self'", 'plausible.jaw.dev', 'ip.jaw.dev'],
				'script-src': [
					"'self'",
					"'unsafe-inline'",
					'plausible.jaw.dev',
					'blob:',
					'text/javascript',
				],
				'worker-src': ["'self'", 'blob:'],
			},
		},
	}),
);
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		store: redisStore,
		saveUninitialized: true,
		proxy: process.env.NODE_ENV === 'production',
		cookie: {
			httpOnly: process.env.NODE_ENV === 'production',
			secure: process.env.NODE_ENV === 'production',
		},
	}),
);
app.use(localVariables);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(express.static(path.resolve(path.join(process.cwd(), 'public')), { maxAge: '24h' }));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'views', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'views', 'layouts', 'main.html')));
app.use(expressLayouts);

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
