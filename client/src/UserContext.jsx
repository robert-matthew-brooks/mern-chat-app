import { useState, useEffect, createContext } from 'react';
import { getProfileFromCookie } from './js/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  function setUser(user) {
    if (!user) {
      user = { id: null, username: null, contacts: [] };
    }

    setId(user.id);
    setUsername(user.username);
    if (user.contacts) setContacts(user.contacts);
    setActiveContact(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const userData = await getProfileFromCookie();
        setUser(userData);
      } catch (err) {
        if (err?.response?.status === 401) {
          console.log('401: no cookie token found');
        } else {
          console.error(err);
          throw err;
        }
      }
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        id,
        username,
        contacts,
        activeContact,
        setUser,
        setContacts,
        setActiveContact,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
