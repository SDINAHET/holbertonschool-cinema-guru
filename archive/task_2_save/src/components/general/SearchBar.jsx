// src/components/general/SearchBar.jsx
import './general.css';

function SearchBar({ title, setTitle, icon }) {
  const handleInput = (event) => {
    if (setTitle) {
      setTitle(event.target.value);
    }
  };

  return (
    <div className="general-searchbar">
      {icon && <span className="general-searchbar-icon">{icon}</span>}
      <input
        type="text"
        className="general-searchbar-input"
        placeholder="Search Movies"
        value={title}
        onChange={handleInput}
      />
    </div>
  );
}

export default SearchBar;
