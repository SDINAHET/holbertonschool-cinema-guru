// src/components/general/Button.jsx
import './general.css';

function Button({
  label,
  className = '',
  onClick,
  icon,
}) {
  return (
    <button
      type="button"
      className={`general-button ${className}`}
      onClick={onClick}
    >
      {icon && <span className="general-icon general-button-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default Button;
