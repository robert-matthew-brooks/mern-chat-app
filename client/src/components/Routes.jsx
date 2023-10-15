import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Login from './Login';
import Main from './Main';

export default function Routes() {
  const { username } = useContext(UserContext);

  if (!username) return <Login />;
  else return <Main />;
}
