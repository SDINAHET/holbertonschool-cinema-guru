// src/components/general/SelectInput.jsx
import './general.css';

function SelectInput({
  label,
  options = [],
  className = '',
  value,
  setValue,
}) {
  const handleSelect = (event) => {
    if (setValue) {
      setValue(event.target.value);
    }
  };

  return (
    <div className={`general-field ${className}`}>
      {label && <label className="general-label">{label}</label>}

      <select
        className="general-select"
        value={value}
        onChange={handleSelect}
      >
        {options.map((option) => (
          <option
            key={option.value ?? option}
            value={option.value ?? option}
          >
            {option.label ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
