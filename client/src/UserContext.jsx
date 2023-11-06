import { useState, useEffect, createContext } from 'react';
import { getProfileFromToken } from './js/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);

  function setUser(user) {
    if (!user) {
      user = {
        token: null,
        id: null,
        username: null,
        contacts: null,
      };
    }

    setToken(user.token);
    if (user.token) localStorage.token = user.token;
    else delete localStorage.token;

    setId(user.id);
    setUsername(user.username);
    setContacts(user.contacts || []);
    setActiveContact(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const userData = await getProfileFromToken(localStorage.token);
        setUser({ ...userData, token: localStorage.token });
      } catch (err) {
        if (err?.response?.status === 403) {
          console.log('403: invalid token or cookie');
        } else {
          throw err;
        }
      }
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        token,
        id,
        username,
        contacts,
        activeContact,
        setToken,
        setUser,
        setContacts,
        setActiveContact,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
