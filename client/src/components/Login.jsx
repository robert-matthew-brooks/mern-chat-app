import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { register, login } from '../js/api';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('testbob');
  const [password, setPassword] = useState('testpass1');
  const [errorMsg, setErrorMsg] = useState('');
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  function validateUsername() {
    const usernameInput = document.getElementById('Login__username');
    usernameInput.classList.remove(...usernameInput.classList);

    if (!username) {
      setErrorMsg('Username - cannot be blank');
    } else if (username.length < 3 || username.length > 20) {
      setErrorMsg('Username - between 3 and 20 characters');
    } else if (!/^[\w\d]+$/i.test(username)) {
      setErrorMsg('Username - letters and numbers only');
    } else {
      setErrorMsg('');
      return true;
    }

    usernameInput.classList.add('Login__input--invalid');
    return false;
  }

  function validatePassword() {
    const passwordInput = document.getElementById('Login__password');
    passwordInput.classList.remove(...passwordInput.classList);

    if (!password) {
      setErrorMsg('Password - cannot be blank');
    } else if (password.length < 6 || password.length > 20) {
      setErrorMsg('Password - between 6 and 20 characters');
    } else if (!/[a-z]/gi.test(password)) {
      setErrorMsg('Password - must contain a letter');
    } else if (!/[\d]/gi.test(password)) {
      setErrorMsg('Password - must contain a number');
    } else {
      setErrorMsg('');
      return true;
    }

    passwordInput.classList.add('Login__input--invalid');
    return false;
  }

  async function handleRegister() {
    if (validateUsername() && validatePassword()) {
      try {
        const registeredUser = await register({ username, password });
        setLoggedInUsername(registeredUser.username);
        setId(registeredUser.id);
      } catch (err) {
        if (err?.response?.data?.code === '11000') {
          setErrorMsg('Username already exists');
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  }

  async function handleLogin() {
    if (validateUsername() && validatePassword()) {
      try {
        const foundUser = await login({ username, password });
        setLoggedInUsername(foundUser.username);
        setId(foundUser.id);
      } catch (err) {
        if (err?.response?.status === 401) {
          setErrorMsg('Incorrect password');
        } else if (err?.response?.status === 403) {
          setErrorMsg('Username not found');
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  }

  return (
    <form
      id="Login"
      onSubmit={(evt) => {
        evt.preventDefault();
      }}
    >
      <input
        id="Login__username"
        type="text"
        value={username}
        placeholder="Username"
        onChange={(evt) => {
          setUsername(evt.target.value);
        }}
        onBlur={validateUsername}
      />
      <input
        id="Login__password"
        type="password"
        value={password}
        placeholder="Password"
        onChange={(evt) => {
          setPassword(evt.target.value);
        }}
        onBlur={validatePassword}
      />

      <div id="Login__btn-wrapper">
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </div>

      <p id="Login__status" style={{ display: errorMsg ? 'block' : 'none' }}>
        {errorMsg}
      </p>
    </form>
  );
}
