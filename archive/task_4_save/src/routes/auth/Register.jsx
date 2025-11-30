// src/routes/auth/Register.jsx
import './auth.css';
import Input from '../../components/general/Input';
import Button from '../../components/general/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faPlus } from '@fortawesome/free-solid-svg-icons';

function Register({ username, password, setUsername, setPassword }) {
  return (
    <div className="auth-content">
      <h2 className="auth-title">Create a new account</h2>

      <div className="auth-field">
        <Input
          label="Username:"
          type="text"
          value={username}
          setValue={setUsername}
          icon={<FontAwesomeIcon icon={faUser} />}
        />
      </div>

      <div className="auth-field">
        <Input
          label="Password:"
          type="password"
          value={password}
          setValue={setPassword}
          icon={<FontAwesomeIcon icon={faKey} />}
        />
      </div>

      <div className="auth-actions">
        <Button
          label="Sign Up"
          className="auth-submit"
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      </div>
    </div>
  );
}

export default Register;
