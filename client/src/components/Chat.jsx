import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import Loading from './Loading';
import Message from './Message';
import { getMessages, addMessage } from '../js/api';
import './Chat.css';

export default function Chat({ ws, wsMessages, setWsMessages }) {
  const { id, token, activeContact, setActiveContact, contacts } =
    useContext(UserContext);
  const [message, setMessage] = useState('');
  const [tip, setTip] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
      return msg.senderId === activeContact?.id;
    });

    const allMessages = [...filteredWsMessages, ...messages].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return allMessages;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (message) {
      setTip(null);

      const newMessage = {
        senderId: id,
        recipientId: activeContact.id,
        body: message,
        createdAt: new Date().toISOString(),
      };

      // update local (optimistic)
      setMessages([newMessage, ...messages]);
      setMessage('');
      messagesBox.scrollTop = messagesBox.scrollHeight;

      // send message to websocket
      ws.send(JSON.stringify(newMessage));

      // update backend server
      try {
        await addMessage(activeContact.id, message, token);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    setIsError(false);
    setWsMessages([]);

    (async () => {
      setIsLoading(true);

      try {
        if (activeContact) {
          const { messages } = await getMessages(activeContact?.id, token);
          setMessages(messages);
          updateTip(messages);
        } else {
          setMessages([]);
          updateTip();
        }
      } catch (err) {
        setIsError(true);
        console.error(err);
      }

      setIsLoading(false);
      if (inputBox) inputBox.focus();
    })();
  }, [activeContact]);

  if (isError) {
    return (
      <div id="Chat--error">
        <p>Server Error</p>
        <button
          onClick={() => {
            setActiveContact({ ...activeContact });
          }}
        >
          Retry
        </button>
      </div>
    );
  } else
    return (
      <div id="Chat">
        <Loading isLoading={isLoading}>
          <div
            id="Chat__tip"
            style={{ display: getAllMessages().length > 0 && 'none' }}
          >
            {tip}
          </div>
          <div
            id="Chat__messages"
            style={{ display: !getAllMessages().length && 'none' }}
          >
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
        </Loading>
      </div>
    );
}
