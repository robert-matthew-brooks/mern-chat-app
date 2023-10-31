import { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { register, login } from '../js/api';
import './Login.css';
//

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { setUser } = useContext(UserContext);

  const autofill = () => {
    setUsername('bob_test');
    setPassword('testpass1');
  };

  const validateUsername = () => {
    const userBox = document.getElementById('Login__username');
    userBox.classList.remove(...userBox.classList);

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

    userBox.classList.add('Login__input--invalid');
    return false;
  };

  const validatePassword = () => {
    const passBox = document.getElementById('Login__password');
    passBox.classList.remove(...passBox.classList);

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

    passBox.classList.add('Login__input--invalid');
    return false;
  };

  const handleRegister = async () => {
    if (validateUsername() && validatePassword()) {
      try {
        const registeredUser = await register(username, password);
        setUser(registeredUser);
      } catch (err) {
        if (err?.response?.status === 422) {
          setErrorMsg('Username already exists');
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  };

  const handleLogin = async () => {
    if (validateUsername() && validatePassword()) {
      try {
        const foundUser = await login(username, password);
        setUser(foundUser);
      } catch (err) {
        if (err?.response?.status === 403) {
          setErrorMsg('Username not found');
        } else if (err?.response?.status === 401) {
          setErrorMsg('Incorrect password');
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  };

  return (
    <div id="Login">
      <form
        id="Login__form"
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
          <input type="button" value="Register" onClick={handleRegister} />
          <input type="submit" value="Login" onClick={handleLogin} />
        </div>

        <p
          id="Login__err-status"
          style={{ display: errorMsg ? 'block' : 'none' }}
        >
          {errorMsg}
        </p>
      </form>

      <p id="Login__guide">
        Demo account:
        <br />
        (Click to autofill)
        <br />
        <br />
        <button onClick={autofill}>
          bob_test
          <br />
          testpass1
        </button>
      </p>
    </div>
  );
}
