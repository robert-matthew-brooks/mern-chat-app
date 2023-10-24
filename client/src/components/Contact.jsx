import { useContext } from 'react';
import { UserContext } from '../UserContext';
import './Contact.css';

export default function Contact({ contact, isOnline, isActive }) {
  const { setActiveContact } = useContext(UserContext);

  const handleContactClick = (contact) => {
    setActiveContact(contact);
  };

  return (
    <div
      className={`
        Contact
        ${isOnline && 'Contact--online'}
        ${isActive && 'Contact--active'}
      `}
      onClick={() => {
        handleContactClick(contact);
      }}
    >
      <div className="Contact__avatar">
        <div className="Contact__status"></div>
        {contact.username[0]}
      </div>
      <div className="Contact__username">{contact.username}</div>
    </div>
  );
}
