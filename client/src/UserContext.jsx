import { useState, useEffect, createContext } from 'react';
import * as api from './js/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const userData = await api.getProfileFromToken();
        setId(userData.id);
        setUsername(userData.username);
        console.log(userData);
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
    <UserContext.Provider value={{ id, setId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
