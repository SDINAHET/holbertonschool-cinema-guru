// src/routes/auth/Authentication.jsx
import { useState } from 'react';
import './auth.css';
import Login from './Login';
import Register from './Register';

function Authentication({ setIsLoggedIn, setUserUsername }) {
  // true => Sign In, false => Sign Up
  const [_switchBoolean, setSwitchBoolean] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInClick = () => {
    setSwitchBoolean(true);
  };

  const handleSignUpClick = () => {
    setSwitchBoolean(false);
  };

  // La soumission réelle (appel API) sera faite dans les tasks suivantes
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${_switchBoolean ? 'active' : ''}`}
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!_switchBoolean ? 'active' : ''}`}
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>

        {_switchBoolean ? (
          <Login
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        ) : (
          <Register
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        )}
      </form>
    </div>
  );
}

export default Authentication;
