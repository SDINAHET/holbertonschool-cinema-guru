// src/components/general/Input.jsx
import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import './general.css';

function Input({
  label,
  type = 'text',
  className = '',
  value,
  setValue,
  icon,
  inputAttributes = {},
  validateValue, // ⭐ Nouveau
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  const handleInput = (event) => {
    let newValue = event.target.value;

    // Si une fonction de validation est fournie → on l’utilise
    if (validateValue) {
      newValue = validateValue(newValue);
    }

    if (setValue) {
      setValue(newValue);
    }
  };


  const inputType = isPasswordField && showPassword ? "text" : type;


  //   if (setValue) {
  //     setValue(event.target.value);
  //   }
  // };

//   return (
//     <div className={`general-field ${className}`}>
//       {label && <label className="general-label">{label}</label>}

//       <div className="general-input-wrapper">
//         {icon && <span className="general-icon">{icon}</span>}

//         <input
//           type={type}
//           value={value}
//           onChange={handleInput}
//           className="general-input"
//           {...inputAttributes}
//         />
//       </div>
//     </div>
//   );
// }

// export default Input;

return (
    <div className={`general-field ${className}`}>
      {label && (
        <label className="general-label">
          {icon && <span className="general-label-icon">{icon}</span>}
          {label}
        </label>
      )}

      <div className="general-input-wrapper">
        <input
          type={inputType}
          value={value}
          onChange={handleInput}
          className="general-input"
          {...inputAttributes}
        />

        {isPasswordField && (
          <span
            className="general-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <span className="material-icons">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default Input;
