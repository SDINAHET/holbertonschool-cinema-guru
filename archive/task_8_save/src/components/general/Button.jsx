// src/components/general/Button.jsx
import './general.css';

function Button({
  label,
  className = '',
  onClick,
  icon,
  type = 'button',          // ⬅️ nouveau paramètre avec valeur par défaut
}) {
  return (
    <button
      // type="button"
      type={type}     // ⬅️ utiliser la prop ici
      className={`general-button ${className}`}
      onClick={onClick}
    >
      {icon && <span className="general-icon general-button-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export default Button;
