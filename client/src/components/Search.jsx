import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import ClearBtn from './ClearBtn';
import { filterUsers, addContact } from '../js/api';
import './Search.css';

export default function Search() {
  const { id, username, contacts, setContacts, setActiveContact } =
    useContext(UserContext);
  const [searchStr, setSearchStr] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);

  const handleSearchChange = async (searchStr) => {
    setSearchStr(searchStr);

    if (searchStr) {
      if (!/^[\w\d]+$/i.test(searchStr)) {
        setFoundUsers([]);
      } else {
        const { found_users: foundUsers } = await filterUsers(searchStr, 10);
        setFoundUsers(foundUsers.filter((user) => user.username !== username));
      }
    }
  };

  const handleSearchResultClick = async (userToAdd) => {
    setSearchStr('');

    const isAlreadyContact =
      contacts.filter((contact) => {
        return userToAdd._id === contact._id;
      }).length > 0;

    if (!isAlreadyContact) {
      await addContact(id, userToAdd._id);
      setContacts([userToAdd, ...contacts]);
    }

    setActiveContact(userToAdd);
  };

  return (
    <div id="Search">
      <input
        id="Search__input"
        value={searchStr}
        onChange={(evt) => {
          handleSearchChange(evt.target.value);
        }}
        placeholder="Search users..."
        autoComplete="off"
        action="..."
      />

      <ClearBtn
        cb={() => {
          setSearchStr('');
        }}
        toggle={searchStr}
      />

      <div
        id="Search__results"
        style={{ display: searchStr.length > 0 ? 'block' : 'none' }}
      >
        <div
          id="Search__results__no-results"
          style={{ display: foundUsers.length ? 'none' : 'block' }}
        >
          [No results]
        </div>

        {foundUsers.map((user, i) => {
          return (
            <div
              key={i}
              className="Search__results__user"
              onClick={() => {
                handleSearchResultClick(user);
              }}
            >
              {user.username}
            </div>
          );
        })}
      </div>
    </div>
  );
}
