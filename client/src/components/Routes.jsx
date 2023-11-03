import { useContext } from 'react';
import { UserContext } from '../UserContext';
import Login from './Login';
import Main from './Main';

export default function Routes() {
  const { token } = useContext(UserContext);

  if (!token) return <Login />;
  else return <Main />;
}
