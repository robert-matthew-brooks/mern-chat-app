import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { logout } from '../js/api';
import Search from './Search';
import './Nav.css';

export default function Nav() {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div id="Nav">
      <p id="Nav__title">MERN Chat App</p>

      <Search />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
