import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import Nav from './Nav';
import Contacts from './Contacts';
import Chat from './Chat';
import './Main.css';

export default function Main() {
  const { activeContact } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [wsMsgBuffer, setWsMsgBuffer] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(['none']);

  useEffect(() => {
    const wss =
      process.env.NODE_ENV === 'production'
        ? 'ws://be-mern-chat-app.onrender.com'
        : 'ws://localhost:9090';

    const ws = new WebSocket(wss);
    setWs(ws);

    ws.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);

      if (data.hasOwnProperty('clients')) {
        setOnlineUserIds(
          data.clients
            .map((client) => client.id)
            .filter((id, i, ids) => ids.indexOf(id) === i)
        );
      }

      if (data.hasOwnProperty('message')) {
        setWsMsgBuffer(data.message);
      }
    });
  }, []);

  useEffect(() => {
    if (wsMsgBuffer) {
      setWsMessages([wsMsgBuffer, ...wsMessages]);
    }
  }, [wsMsgBuffer]);

  return (
    <div
      id="Main"
      className={activeContact ? 'Main--mobile-chat' : 'Main--mobile-contacts'}
    >
      <Nav ws={ws} />
      <Contacts onlineUserIds={onlineUserIds} />
      <Chat ws={ws} wsMessages={wsMessages} setWsMessages={setWsMessages} />
    </div>
  );
}
