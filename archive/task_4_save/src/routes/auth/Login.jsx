// src/routes/auth/Login.jsx
import './auth.css';
import Input from '../../components/general/Input';
import Button from '../../components/general/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

function Login({ username, password, setUsername, setPassword }) {
  return (
    <div className="auth-content">
      <h2 className="auth-title">Sign in with your account</h2>

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
        {/* ✅ icône clé sur le bouton */}
        <Button
          label="Sign In"
          className="auth-submit"
          icon={<FontAwesomeIcon icon={faKey} />}
        />
      </div>
    </div>
  );
}

export default Login;
