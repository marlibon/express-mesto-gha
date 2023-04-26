const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { PORT = 3000, BASE_PATH = 'https://localhost.ru' } = process.env;
const routes = require('./routes/index');
const { errors } = require('celebrate');

// распарсим данные, которые пришли
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
//подключаемся к БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('DB is connected'))
  .catch(err => console.log(err));

// опции для заголовков. Разрешаем доступ с любого места и определяем доступные методы
const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOptions));

// настройка роутов
app.use(routes);

// обработка ошибок celebrate
app.use(errors());

// выводим index.html при обращении через браузер
app.use(express.static(path.join(__dirname, 'public')));

// вывод в консоль информации, куда подключаться
app.listen(PORT, () => {
  console.log('Ссылка на сервер:', `${BASE_PATH}:${PORT}`);
});
