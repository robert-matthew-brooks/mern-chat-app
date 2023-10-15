import { useContext } from 'react';
import { UserContext } from '../UserContext';
import './Chat.css';

export default function Chat() {
  const { id, username, activeContact, contacts } = useContext(UserContext);

  if (!activeContact) {
    if (!contacts.length) {
      return <div className="Chat Chat--none">Add a contact to chat...</div>;
    } else {
      return <div className="Chat Chat--none">&larr; Choose a contact...</div>;
    }
  } else {
    return (
      <div className="Chat">
        Get conversation:
        <br />
        <br />
        {username}
        <br />
        {id}
        <br />
        <br />
        {activeContact.username}
        <br />
        {activeContact._id}
      </div>
    );
  }
}
