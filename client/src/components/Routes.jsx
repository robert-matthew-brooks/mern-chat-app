import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Login from './Login';

export default function Routes() {
  const { username } = useContext(UserContext);

  if (username) return `logged in ${username}`;
  else return <Login />;
}
