const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('connected to DB'));

app.listen(process.env.PORT, () =>
  console.log(`Server is running at port ${process.env.PORT}`)
);
