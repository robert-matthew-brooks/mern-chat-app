import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import Message from './Message';
import { getMessages, addMessage } from '../js/api';
import './Chat.css';

export default function Chat({ ws, wsMessages, setWsMessages }) {
  const { id, activeContact, contacts } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [tip, setTip] = useState(null);
  const [messages, setMessages] = useState([]);

  const inputBox = document.getElementById('Chat__form__input');
  const messagesBox = document.getElementById('Chat__messages');

  const updateTip = (messages) => {
    if (!contacts.length) {
      setTip('↑ Add a user');
    } else if (!activeContact) {
      setTip('← Choose a contact');
    } else if (!messages.length) {
      setTip('↓ Send a message');
    } else {
      setTip(null);
    }
  };

  const getAllMessages = () => {
    const filteredWsMessages = wsMessages.filter((msg) => {
      return msg.senderId === activeContact._id;
    });

    return [...filteredWsMessages, ...messages];
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (message) {
      const newMessage = {
        senderId: id,
        recipientId: activeContact._id,
        body: message,
        createdAt: new Date().toISOString(),
      };

      // update local (optimistic)
      setMessages([newMessage, ...messages]);

      // send message to websocket
      ws.send(JSON.stringify(newMessage));

      // update backend server
      try {
        await addMessage(activeContact._id, message);
      } catch (err) {
        console.error(err);
      }

      setMessage('');
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }
  };

  useEffect(() => {
    setWsMessages([]);

    (async () => {
      try {
        if (activeContact) {
          const { messages } = await getMessages(activeContact?._id);
          setMessages(messages);
          updateTip(messages);
        } else {
          updateTip();
        }
      } catch (err) {
        console.error(err);
      }
    })();

    if (inputBox) inputBox.focus();
  }, [activeContact]);

  return (
    <div id="Chat">
      <div id="Chat__tip" style={{ display: !tip && 'none' }}>
        {tip}
      </div>
      <div id="Chat__messages" style={{ display: !messages.length && 'none' }}>
        {getAllMessages().map((message, i) => {
          return <Message key={i} message={message} />;
        })}
      </div>
      <form
        id="Chat__form"
        style={{ display: !activeContact && 'none' }}
        onSubmit={(evt) => handleSubmit(evt)}
      >
        <input
          id="Chat__form__input"
          type="text"
          value={message}
          onChange={(evt) => setMessage(evt.target.value)}
          placeholder="Message"
          autoComplete="off"
        />
        <button type="submit" id="Chat__form__button">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
