const ws = require('ws');
const { getUserDataFromCookie } = require('./util/token');

const broadcastClients = (wss) => {
  const clients = [...wss.clients];

  const clientsData = clients.map((client) => {
    return {
      id: client.id,
      username: client.username,
    };
  });

  clients.forEach((client) => {
    client.send(JSON.stringify({ clients: clientsData }));
  });
};

function run(server) {
  const wss = new ws.WebSocketServer({ server });

  wss.on('connection', async (connection, req) => {
    req.query = { token: req.url.split('?token=')[1] };
    const { id, username } = await getUserDataFromCookie(req);
    connection.id = id;
    connection.username = username;

    // send all connected clients the connected client list
    broadcastClients(wss);

    // ping client and start disconnect timer
    connection.pingTimer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        // kill connection
        clearInterval(connection.pingTimer);
        connection.terminate();

        // send everyone the new client list
        broadcastClients(wss);
      }, 1000);
    }, 5000);

    // ping back received - cancel disconnect timer
    connection.on('pong', () => {
      clearTimeout(connection.deathTimer);
    });

    // pass on user message via ws
    connection.on('message', (data) => {
      const message = JSON.parse(data.toString());

      const recipient = [...wss.clients].find(
        (client) => client.id === message.recipientId
      );

      if (recipient) recipient.send(JSON.stringify({ message }));
    });
  });
}

module.exports = { run };
