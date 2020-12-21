const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const schedule = require('node-schedule');

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

const User = require('./models/userModel');
const sendEmail = require('./util/email');

schedule.scheduleJob('*/5 * * * *', async () => {
  const users = await User.find();
  const dateNow = new Date(Date.now());
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const subject = `Your Bill for the Month of ${
    monthNames[new Date().getMonth()]
  }`;

  for (let user of users) {
    const userBillDate = new Date(user.billDate);
    const billSentDate = new Date(user.billSentDate);

    if (
      userBillDate.getDate() === dateNow.getDate() &&
      billSentDate.toLocaleDateString() !== dateNow.toLocaleDateString()
    ) {
      user.billSentDate = new Date(Date.now()).toLocaleDateString();
      user.balance = user.balance + user.monthlyBill;
      await user.save();

      const message = `Dear ${user.name},\n\n\nWe're pleased to send your e-Bill with the following details:\n\nAmount to pay: ${user.balance}`;

      await sendEmail({
        from: `Sender <no-reply@sender.com>`,
        email: user.email,
        subject,
        message,
      });
      console.log(
        `e-bill sent to ${user.email} at ${new Date(
          Date.now()
        ).toLocaleDateString()}`
      );
    }
  }
});

app.use(errorController);

module.exports = app;
