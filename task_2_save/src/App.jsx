// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

import Input from './components/general/Input';
import SelectInput from './components/general/SelectInput';
import Button from './components/general/Button';
import SearchBar from './components/general/SearchBar';

function App() {
  const [username, setUsername] = useState('');
  const [sort, setSort] = useState('default');
  const [title, setTitle] = useState('');

  // const [minDate, setMinDate] = useState(1970);

  const [minDate, setMinDate] = useState("");

  const validateMinDate = (val) => {
    // si vide → rester vide
    if (val === "") return "";

    // Tant que l'utilisateur n'a pas écrit 4 chiffres → ne rien valider
    if (val.length < 4) return val;

    const num = parseInt(val, 10);

    // si pas un nombre → garder vide
    if (isNaN(num)) return "";

    // si < 1970 → remplacer par 1970
    if (num < 1970) return 1970;

    // sinon → permettre la saisie normale
    return num;
  };

  return (
    <div className="App">
      <Input
        label="Username:"
        type="text"
        value={username}
        setValue={setUsername}
        // inputAttributes={{ min: 1970 }}   // ⬅️ min HTML
        icon={<FontAwesomeIcon icon={faUser} />}
      />

      <Input
        // label="Min Date:"
        // type="text"
        // value="1970"
        // setValue={() => {}}
        label="Min Date:"
        type="number"
        value={minDate}
        setValue={setMinDate}
        validateValue={validateMinDate}
        // inputAttributes={{ }}         // bonus : min HTML aussi
      />

      <SelectInput
        label="Sort:"
        value={sort}
        setValue={setSort}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'latest', label: 'Latest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'highest_rated', label: 'Highest Rated' },
          { value: 'lowest_rated', label: 'Lowest Rated' },
        ]}
      />

      <Button
        label="Load More.."
        onClick={() => console.log('Load more')}
      />

      <SearchBar
        title={title}
        setTitle={setTitle}
        icon={<FontAwesomeIcon icon={faSearch} />}
      />
    </div>
  );
}

export default App;
