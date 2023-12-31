const app = require('./app');
const wss = require('./wss');

const port = 9090;

const server = app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Listening on port ${port}`);
  }
});

wss.run(server);
