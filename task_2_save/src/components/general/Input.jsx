// src/components/general/Input.jsx
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
          type={type}
          value={value}
          onChange={handleInput}
          className="general-input"
          {...inputAttributes}
        />
      </div>
    </div>
  );
}

export default Input;
