const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const { ErrorModel } = require('./models');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Подключение к базе данных PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'epfub76**',
  database: 'Errors',
});

// Проверка подключения к базе данных
sequelize
  .authenticate()
  .then(() => {
    console.log('Подключено к базе данных PostgreSQL');
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
  });

// Обработка запросов на главной странице
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Обработка POST-запроса с номером ошибки
app.post('/search', async (req, res) => {
  const errorCode = req.body.errorCode;
  const searchQuery = req.body.searchQuery;

  try {
    // Поиск в базе данных с использованием Sequelize
    const resultByCode = await ErrorModel.findOne({
      where: { code: searchQuery },
    });

    const resultByText = await ErrorModel.findOne({
      where: { errtext: { [Sequelize.Op.iLike]: `%${searchQuery}%` } },
    });

    if (resultByCode || resultByText) {
      // Если результаты найдены, выводим рекомендацию
      const recommendation = resultByCode
        ? resultByCode.recommendation
        : resultByText.recommendation;
      res.send(`Рекомендация: ${recommendation}`);
    } else {
      res.send('Рекомендации не найдены');
    }
  } catch (err) {
    console.error('Ошибка запроса к базе данных:', err);
    res.send('Произошла ошибка при выполнении запроса к базе данных');
  }
  try {
    // Поиск в базе данных с использованием Sequelize
    const result = await ErrorModel.findOne({
      where: { code: errorCode },
    });

    if (result) {
      // Если результаты найдены, выводим рекомендацию
      const recommendation = result.recommendation;
      res.send(`Рекомендация: ${recommendation}`);
    } else {
      res.send('Рекомендации не найдены');
    }
  } catch (err) {
    console.error('Ошибка запроса к базе данных:', err);
    res.send('Произошла ошибка при выполнении запроса к базе данных');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
