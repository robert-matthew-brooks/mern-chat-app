import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { logout, deleteUser } from '../js/api';
import Loading from './Loading';
import Search from './Search';
import megaphoneImg from '../assets/megaphone.svg';
import './Nav.css';

export default function Nav({ ws }) {
  const { token, username, setUser, activeContact, setActiveContact } =
    useContext(UserContext);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    await logout();
    ws.close();
    setIsLogoutLoading(false);
    setUser(null);
  };

  const handleDeleteAccount = async () => {
    setIsDeleteLoading(true);
    await deleteUser(token);
    ws.close();
    setIsDeleteLoading(false);
    setUser(null);
  };

  return (
    <>
      <div id="Nav">
        <p id="Nav__title">
          <img src={megaphoneImg} />
          Bob Chat
        </p>
        <Search />

        <button
          id="Nav__back-btn"
          style={{ display: !activeContact && 'none' }}
          onClick={() => {
            setActiveContact(null);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
        </button>

        <button id="Nav__menu-btn" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <div id="Nav__user-menu" style={{ top: !isMenuVisible && '0' }}>
        <p>{username}</p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleteLoading || isLogoutLoading}
        >
          <Loading isLoading={isDeleteLoading}>Delete Account</Loading>
        </button>

        <button
          onClick={handleLogout}
          disabled={isDeleteLoading || isLogoutLoading}
        >
          <Loading isLoading={isLogoutLoading}>Logout</Loading>
        </button>
      </div>
      <div
        id="Nav__hide-menu-layer"
        style={{
          height: !isMenuVisible && '0',
          opacity: isMenuVisible && '0.7',
        }}
        onClick={toggleMenu}
      ></div>
    </>
  );
}
