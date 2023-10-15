import { useContext } from 'react';
import { UserContext } from '../UserContext';
import './Contact.css';

export default function Contact({ contact, isActive }) {
  const { setActiveContact } = useContext(UserContext);

  const handleContactClick = (contact) => {
    setActiveContact(contact);
  };

  return (
    <div
      className={`Contact ${isActive && 'Contact--active'}`}
      onClick={() => {
        handleContactClick(contact);
      }}
    >
      <div className="Contact__avatar">{contact.username[0]}</div>
      <div>{contact.username}</div>
    </div>
  );
}
