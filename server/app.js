const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const compression = require('compression');

const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');
const adminRouter = require('./routes/adminRoutes');

const errorController = require('./controllers/errorController');

const AppError = require('./util/appError');

const app = express();

app.enable('trust proxy');

app.use(
  cors({
    origin: 'https://email-client-sender.vercel.app',
    methods: ['POST', 'PATCH', 'DELETE', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

app.use(helmet());
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request! Please try again later.',
  })
);

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.use(compression());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/admin', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
