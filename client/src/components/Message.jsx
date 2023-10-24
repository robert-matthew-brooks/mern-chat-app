import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { getShortTime } from '../js/util';
import './Message.css';

export default function MsgBubble({ message }) {
  const { id } = useContext(UserContext);

  const date = new Date(message.createdAt);
  const time = getShortTime(date);

  return (
    <div
      className={`Message ${
        message.senderId === id ? 'Message--user' : 'Message--contact'
      }`}
    >
      <p
        className={`MsgBubble ${
          message.senderId === id ? 'MsgBubble--user' : 'MsgBubble--contact'
        }`}
      >
        {message.body}
      </p>

      <p className="Message__timestamp">{time}</p>
    </div>
  );
}
