import './env';
import './db';

import helmet from 'helmet';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import json from './middlewares/json';
import compression from 'compression';
import ApiRouter from './routes'; // api phải cần đăng nhập mới dùng được => Trả ra lỗi
import webRoutes from './webRoutes'; // api không cần đăng nhập
import logger, { logStream } from './utils/logger';
import authenticateRoutes from './routes/apiRouter/authenticateRoutes';
import * as errorHandler from './middlewares/errorHandler';

console.log('ROOT_DIR: ', process.cwd());

const app = express();

app.set('port', process.env.WEB_PORT);
// app.set('host', process.env.WEB_BASE_URL);
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: [
			'Content-Type',
			'Cache-Control',
			'X-Requested-With',
			'X-Auth-Key',
			'X-Auth-Email',
			'authorization',
			'username',
			'token',
		],
		exposedHeaders: ['Content-Range', 'X-Content-Range'],
		credentials: true,
		maxAge: 3600,
	})
);
app.use(helmet());
app.use(compression());
app.use(morgan('short', { stream: logStream }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(errorHandler.bodyParser);
app.use(json);

app.use('/web', webRoutes);

app.use(
	expressJwt({
		secret: process.env.JWT_SECRET,
		requestProperty: 'auth',
		credentialsRequired: false,
		getToken: function fromHeaderOrQuerystring(req) {
			if (req.headers['x-auth-key']) {
				return req.headers['x-auth-key'];
			}
			if (req.query && req.query.token) {
				return req.query.token;
			}
			return null;
		},
	}).unless({ path: ['/authenticate'] })
);

app.all('/api/*', (req, res, next) => {
	if (!req.auth) {
		const err = new Error('Not Authorized');

		err.code = 202;
		err.status = 401;
		err.message = 'Bạn chưa đăng nhập';

		throw err;
	}
	next();
});

app.use('/auth', authenticateRoutes); // path xử lý login create user
app.use('/api', ApiRouter); // call api cần token

app.locals.title = process.env.WEB_NAME;
app.locals.version = process.env.APP_VERSION || '1.0.0';

app.get('/', (req, res) => res.send('Hello World!'));

app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

app.listen(process.env.PORT || 3000, () => {
	// logger.info(`Server started at http://localhost:${app.get('port')}/api`);
	console.log(`Express server listening on ${process.env.PORT} in %s mode`);
});

// Catch unhandled rejections
process.on('unhandledRejection', (err) => {
	logger.error('Unhandled rejection ', err);

	try {
		// apm.captureError(err);
		// Sentry.captureException(err);
	} catch (err) {
		logger.error('Raven error', err);
	} finally {
		// process.exit(1);
	}
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
	logger.error('Uncaught exception ', err);

	try {
		// apm.captureError(err)
		// Sentry.captureException(err);
	} catch (err) {
		logger.error('Raven error', err);
	} finally {
		// process.exit(1);
	}
});

export default app;
