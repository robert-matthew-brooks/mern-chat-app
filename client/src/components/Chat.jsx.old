import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Chat.css';

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // get contacts

    const ws = new WebSocket('ws://localhost:6789');
    setWs(ws);

    ws.addEventListener('message', handleMessage);
  }, []);

  function handleMessage(evt) {
    const wsData = JSON.parse(evt.data);
    if (wsData.clients) {
      const uniqueClients = [];
      const foundIds = [];
      wsData.clients.forEach((client) => {
        if (!foundIds.includes(client.id)) {
          uniqueClients.push(client);
          foundIds.push(client.id);
        }
      });
      setOnlineUsers(uniqueClients);
    }
  }

  return (
    <div id="Chat">
      <Sidebar onlineUsers={onlineUsers} />

      <main id="Chat__main">
        <header id="Chat__main__header">some title</header>
        <div id="Chat__main__conversation">dsfasdfasdfages</div>
        <form id="Chat__main__message-form">
          <input
            id="Chat__main__message-box"
            type="text"
            placeholder="Message"
          />
          <button id="Chat__main__send-btn" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </main>
    </div>
  );
}
