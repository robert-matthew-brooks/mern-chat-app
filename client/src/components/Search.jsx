import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import Loading from './Loading';
import ClearBtn from './ClearBtn';
import { findUsers, addContact } from '../js/api';
import './Search.css';

export default function Search({ searchStr, setSearchStr, setIsMenuVisible }) {
  const {
    token,
    username,
    contacts,
    setContacts,
    activeContact,
    setActiveContact,
  } = useContext(UserContext);
  const [foundUsers, setFoundUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = async (searchStr) => {
    setIsMenuVisible(false);
    setSearchStr(searchStr);

    if (searchStr) {
      if (!/^[\w\d]+$/i.test(searchStr)) {
        setFoundUsers([]);
      } else {
        setIsLoading(true);
        const { found_users: foundUsers } = await findUsers(searchStr, 10);
        setFoundUsers(foundUsers.filter((user) => user.username !== username));
        setIsLoading(false);
      }
    }
  };

  const handleSearchResultClick = async (userToAdd) => {
    setSearchStr('');

    const isAlreadyContact =
      contacts.filter((contact) => {
        return userToAdd.id === contact.id;
      }).length > 0;

    if (!isAlreadyContact) {
      await addContact(userToAdd.id, token);
      setContacts([...contacts, userToAdd]);
    }

    setActiveContact(userToAdd);
  };

  return (
    <div id="Search" style={{ display: activeContact && 'none' }}>
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
        <Loading isLoading={isLoading}>
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
        </Loading>
      </div>
    </div>
  );
}
