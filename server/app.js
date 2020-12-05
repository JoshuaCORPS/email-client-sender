const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/authRoutes');
const clientRouter = require('./routes/clientRoutes');

const app = express();

if (process.env.ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientRouter);

module.exports = app;
