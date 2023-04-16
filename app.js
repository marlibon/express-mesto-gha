const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const { PORT = 3000, BASE_PATH } = process.env;
const {
  handleErrors,
} = require('./utils/handleErrors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));

app.use((req, res, next) => {
  req.user = {
    _id: '643a7f621ae8a0b5f373f7f3'
  };

  next();
});

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOptions));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('*', function (req, res) {
  handleErrors({ name: 'NotFoundError' }, res)
})
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});
