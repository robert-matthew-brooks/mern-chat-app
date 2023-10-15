import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Contact from './Contact';
import './Contacts.css';

export default function Sidebar() {
  const { contacts, activeContact } = useContext(UserContext);

  return (
    <aside className="Contacts">
      <h2 className="Contacts__title">Contacts:</h2>
      <div className="Contacts__list">
        {contacts.map((contact, i) => {
          const isActive = contact.username === activeContact?.username;
          return <Contact key={i} contact={contact} isActive={isActive} />;
        })}
      </div>
    </aside>
  );
}
