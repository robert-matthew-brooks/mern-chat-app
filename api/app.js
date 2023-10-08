const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./db/connection');
const userController = require('./controllers/user-controller');
const errorHandlers = require('./error-handlers');

// init

dotenv.config();
const clientUrl = process.env.CLIENT_URL;

dbConnect();
const app = express();

// middleware

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: clientUrl,
  })
);

// endpoints

app.get('/status', (_req, res, _next) => {
  res.status(200).send('Server OK');
});

app.get('/profile', userController.getProfile);
app.post('/register', userController.register);
app.post('/login', userController.login);

app.all('*', (_req, res, _next) => {
  res.status(404).send({ msg: 'endpoint not found' });
});

// error handling

app.use(errorHandlers.customErrorHandler);
app.use(errorHandlers.mongoErrorHandler);
app.use(errorHandlers.serverErrorHandler);

module.exports = app;
