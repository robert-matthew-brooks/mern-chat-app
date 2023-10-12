import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import * as api from '../js/api';
import './Sidebar.css';

export default function Sidebar({ onlineUsers }) {
  const { id, setId, username, setUsername } = useContext(UserContext);
  const [searchStr, setSearchStr] = useState('');

  const contacts = [{ id: '6523ebdfdad0d997ef505bc2', username: 'testbob' }];
  const [foundUsers, setFoundUsers] = useState([]);

  async function handleSearchChange(evt) {
    const searchStr = evt.target.value;
    setSearchStr(searchStr);

    if (searchStr) {
      // api call
      const { found_users: foundUsers } = await api.filterUsers(searchStr);
      setFoundUsers(foundUsers);

      // update results
    }
  }

  async function handleLogout() {
    await api.logout();
    setId(null);
    setUsername(null);
  }

  return (
    <aside id="Sidebar">
      <div id="Sidebar__search">
        <input
          value={searchStr}
          onChange={(evt) => {
            handleSearchChange(evt);
          }}
          placeholder="Search users..."
        />

        <button
          id="Sidebar__search__clear-btn"
          onClick={() => {
            setSearchStr('');
          }}
          style={{ display: searchStr ? 'inline' : 'none' }}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div id="Sidebar__list-area">
        <div style={{ display: searchStr ? 'none' : 'block' }}>
          <p>Contacts:</p>
          {contacts.map((contact, i) => {
            return <div key={i}>{contact.username}</div>;
          })}
        </div>

        <div style={{ display: searchStr ? 'block' : 'none' }}>
          <p>Search results:</p>
          {foundUsers.map((user, i) => {
            return <div key={i}>{user.username}</div>;
          })}
        </div>
      </div>

      <div id="Sidebar__user">
        <p>{username}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
    </aside>
  );
}
