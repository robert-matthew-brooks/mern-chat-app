import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Login from './Login';
import Chat from './Chat';

export default function Routes() {
  const { username } = useContext(UserContext);

  if (username) return <Chat />;
  else return <Login />;
}
