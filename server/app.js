const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');
const adminRouter = require('./routes/adminRoutes');

const errorController = require('./controllers/errorController');

const AppError = require('./util/appError');

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/admin', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
