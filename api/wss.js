const ws = require('ws');
const { getProfile } = require('./models/user-model');

const getClients = (wss) => {
  return [...wss.clients];
};

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

function run(server) {
  const wss = new ws.WebSocketServer({ server });

  wss.on('connection', async (connection, req) => {
    const { id, username } = await getUserData(req);
    connection.id = id;
    connection.username = username;

    const clients = getClients(wss);
    const clientsData = clients.map((client) => {
      return {
        id: client.id,
        username: client.username,
      };
    });

    clients.forEach((client) => {
      client.send(JSON.stringify({ clients: clientsData }));
    });
  });
}

module.exports = { run };
