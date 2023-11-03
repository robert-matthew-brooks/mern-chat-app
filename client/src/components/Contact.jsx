import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { removeContact } from '../js/api';
import './Contact.css';

export default function Contact({ contact, isOnline, isActive }) {
  const { token, activeContact, setActiveContact, contacts, setContacts } =
    useContext(UserContext);

  const handleContactClick = (contact) => {
    setActiveContact(contact);
  };

  const handleContactDelete = (evt, contactToDelete) => {
    evt.stopPropagation();
    if (contactToDelete.id === activeContact?.id) {
      setActiveContact(null);
    }

    setContacts(
      contacts.filter((contact) => {
        return contact.id !== contactToDelete.id;
      })
    );
    removeContact(contactToDelete.id, token);
  };

  return (
    <div
      className={`
        Contact
        ${isOnline && 'Contact--online'}
        ${isActive && 'Contact--active'}
      `}
      onClick={(evt) => {
        handleContactClick(contact);
      }}
    >
      <div className="Contact__avatar">
        <div className="Contact__status"></div>
        {contact.username[0]}
      </div>
      <div className="Contact__username">{contact.username}</div>
      <div className="Contact__delete">
        <button
          onClick={(evt) => {
            handleContactDelete(evt, contact);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
