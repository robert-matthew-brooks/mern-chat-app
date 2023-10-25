const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { db, mongoUrl } = require('./db/connection');
const userController = require('./controllers/user-controller');
const messagesController = require('./controllers/messages-controller');
const errorHandlers = require('./error-handlers');
const { reSeed } = require('./db/seed');

// init

dotenv.config();
const clientUrl = process.env.CLIENT_URL;
let reseedTimeout;

db.connect(mongoUrl);
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
if (process.env.NODE_ENV !== 'test') {
  app.use((_req, _res, next) => {
    clearTimeout(reseedTimeout);

    reseedTimeout = setTimeout(async () => {
      console.log('reseed');
      await reSeed();
    }, 600000);

    next();
  });
}

// endpoints

app.get('/status', (_req, res, _next) => {
  res.status(200).send('Server OK');
});

app.get('/user', userController.getProfile);
app.post('/user', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);
app.delete('/user', userController.deleteUser);
app.get('/find/:term', userController.findUsers);
app.post('/contacts/:contact_id', userController.addContact);
app.delete('/contacts/:contact_id', userController.removeContact);

app.get('/messages/:contact_id', messagesController.getMessages);
app.post('/messages/:contact_id', messagesController.addMessage);

app.all('*', (_req, res, _next) => {
  res.status(404).send({ msg: 'endpoint not found' });
});

// error handling

app.use(errorHandlers.customErrorHandler);
app.use(errorHandlers.mongoErrorHandler);
app.use(errorHandlers.serverErrorHandler);

module.exports = app;
