import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import flash from 'connect-flash';
import ejs from 'ejs';
import path from 'path';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { errorHandler, localVariables, notFoundHandler, routes } from './views/routes';

const app = express();

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
		saveUninitialized: true,
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
