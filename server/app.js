const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const compression = require('compression');

const viewRouter = require('./routes/viewRoutes');
const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');
const adminRouter = require('./routes/adminRoutes');

const errorController = require('./controllers/errorController');
const statusController = require('./controllers/statusController');

const AppError = require('./util/appError');

const app = express();

const allowedOrigins = ['https://e-sender.vercel.app', 'http://localhost:3000'];

app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const message = `This site ${origin} doesn't have a permission to access this site.`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
    methods: ['POST', 'PATCH', 'DELETE', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  })
);

app.use(helmet());
app.use(
  '/api',
  rateLimit({
    max: 200,
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

app.use('/api/v1/view', viewRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/admin', adminRouter);
app.get('/api/v1/status', statusController.status);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
