/* eslint-disable no-console */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const INCORRECT_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports = {
  INCORRECT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
mongoose.set('strictQuery', true);

app.use((req, res, next) => {
  req.user = {
    _id: '63bc5b9d99626bc7760b3a95',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
