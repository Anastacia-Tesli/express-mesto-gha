const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.status(NOT_FOUND_ERROR_CODE).send({ message: '404. Такой страницы не существует.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
