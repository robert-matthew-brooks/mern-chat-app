import { useState, useEffect, createContext } from 'react';
import { getProfileFromToken } from './js/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    (async () => {
      const userData = await getProfileFromToken();
      setId(userData.id);
      setUsername(userData.username);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ id, setId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
