require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT);
}).catch(err => {
  process.exit(1);
});
