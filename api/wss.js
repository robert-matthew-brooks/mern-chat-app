const ws = require('ws');
const { getProfile } = require('./models/user-model');

const getUserData = async (req) => {
  const cookies = req.headers.cookie;
  tokenCookieStr = cookies.split(';').find((str) => str.startsWith('token='));
  if (tokenCookieStr) {
    token = tokenCookieStr.split('=')[1];
    if (token) {
      const { userData } = await getProfile(token);
      return { id: userData.id, username: userData.username };
    }
  }
};

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
    const { id, username } = await getUserData(req);
    connection.id = id;
    connection.username = username;
    console.log(`${username} connected`);

    // send all connected clients the connected client list
    broadcastClients(wss);

    // ping client and start disconnect timer
    connection.pingTimer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        // kill connection
        clearInterval(connection.pingTimer);
        connection.terminate();
        console.log(`${username} timed out`);

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
