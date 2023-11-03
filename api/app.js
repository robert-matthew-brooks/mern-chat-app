const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { mongoose, mongoUrl } = require('./db/connection');
const userController = require('./controllers/user-controller');
const messagesController = require('./controllers/messages-controller');
const errorHandlers = require('./error-handlers');
const { seedTestAccounts } = require('./db/seed');

// init

dotenv.config();
const clientUrl = process.env.FE_URL;
let reseedTimeout;

mongoose.connect(mongoUrl);
const app = express();

// middleware

app.set('trust proxy', 1);
app.use(express.json());
app.set('json spaces', 2);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: clientUrl,
  })
);

if (process.env.NODE_ENV !== 'test') {
  // reseed test accounts if no activity for 10 mins
  app.use((_req, _res, next) => {
    clearTimeout(reseedTimeout);

    reseedTimeout = setTimeout(async () => {
      await seedTestAccounts();
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
app.delete('/user', userController.deleteUser);
app.post('/login', userController.login);
app.post('/logout', userController.logout);
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
app.use(errorHandlers.jwtErrorHandler);
app.use(errorHandlers.mongoErrorHandler);
app.use(errorHandlers.serverErrorHandler);

module.exports = app;
