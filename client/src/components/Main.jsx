import { useEffect, useState, useRef } from 'react';
import Nav from './Nav';
import Contacts from './Contacts';
import Chat from './Chat';
import './Main.css';

export default function Main() {
  const [ws, setWs] = useState(null);
  const [wsMsgBuffer, setWsMsgBuffer] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(['none']);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:6789');
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
    <div id="Main">
      <Nav ws={ws} />
      <Contacts onlineUserIds={onlineUserIds} />
      <Chat ws={ws} wsMessages={wsMessages} setWsMessages={setWsMessages} />
    </div>
  );
}
