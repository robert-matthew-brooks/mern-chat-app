import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import Nav from './Nav';
import Contacts from './Contacts';
import Chat from './Chat';
import { getWsUrl } from '../js/urls';
import './Main.css';

export default function Main() {
  const { token, activeContact } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  const [wsMsgBuffer, setWsMsgBuffer] = useState(null);
  const [wsMessages, setWsMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(['none']);

  useEffect(() => {
    const ws = new WebSocket(`${getWsUrl()}?token=${token}`);
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
