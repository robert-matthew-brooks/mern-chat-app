import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Contact from './Contact';
import './Contacts.css';

export default function Sidebar({ onlineUserIds }) {
  const { contacts, activeContact } = useContext(UserContext);

  return (
    <aside className="Contacts">
      <div className="Contacts__list">
        {contacts.map((contact, i) => {
          return (
            <Contact
              key={i}
              contact={contact}
              isOnline={onlineUserIds.includes(contact._id)}
              isActive={contact.username === activeContact?.username}
            />
          );
        })}
      </div>
    </aside>
  );
}
