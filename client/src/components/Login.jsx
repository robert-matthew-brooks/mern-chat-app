import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { register, login, pingServer } from '../js/api';
import LoadingImg from '../assets/loading.svg';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { setUser } = useContext(UserContext);

  const [isServerUp, setIsServerUp] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

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
      setIsRegisterLoading(true);

      try {
        const registeredUser = await register(username, password);
        setUser(registeredUser);
      } catch (err) {
        if (err?.response?.status === 422) {
          setErrorMsg('Username already exists');
        } else {
          setErrorMsg('Server error... please try again later');
          console.error(err);
        }
      }

      setIsRegisterLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoginLoading(true);

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
          setErrorMsg('Server error... please try again later');
          console.error(err);
        }
      }
    }
    setIsLoginLoading(false);
  };

  useEffect(() => {
    (async () => {
      const response = await pingServer();
      if (response?.status === 200) {
        setIsServerUp(true);
      }
    })();
  }, []);

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
          <button
            disabled={isRegisterLoading || isLoginLoading ? true : false}
            onClick={handleRegister}
          >
            {isRegisterLoading ? <img src={LoadingImg} /> : 'Register'}
          </button>
          <button
            type="submit"
            disabled={isRegisterLoading || isLoginLoading ? true : false}
            onClick={handleLogin}
          >
            {isLoginLoading ? <img src={LoadingImg} /> : 'Login'}
          </button>
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
        <button onClick={autofill}>
          bob_test
          <br />
          testpass1
        </button>
        <br />
        <br />
        Server status:
        <br />
        <span
          id="Login__guide__status"
          className={
            isServerUp
              ? 'Login__guide__status--online'
              : 'Login__guide__status--offline'
          }
        >
          {isServerUp ? 'Online' : 'Starting...'}
        </span>
      </p>
    </div>
  );
}
