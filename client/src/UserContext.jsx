import { useState, useEffect, createContext } from 'react';
import { getProfileFromCookie } from './js/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  function setUser(user) {
    if (!user) {
      user = { id: null, token: null, username: null, contacts: [] };
    }

    setId(user.id);
    setUsername(user.username);
    setToken(user.token);
    if (user.contacts) setContacts(user.contacts);
    setActiveContact(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const userData = await getProfileFromCookie();
        setUser(userData);
      } catch (err) {
        if (err?.response?.status === 403) {
          console.log('403: no cookie token found or invalid token');
        } else {
          throw err;
        }
      }
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        id,
        token,
        username,
        contacts,
        activeContact,
        setUser,
        setToken,
        setContacts,
        setActiveContact,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
