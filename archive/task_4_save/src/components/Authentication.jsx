// src/components/Authentication.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

import Input from './general/Input';
import SelectInput from './general/SelectInput';
import Button from './general/Button';
import SearchBar from './general/SearchBar';

function Authentication() {
  const [username, setUsername] = useState('');
  const [sort, setSort] = useState('default');
  const [title, setTitle] = useState('');
  const [minDate, setMinDate] = useState("");

  const validateMinDate = (val) => {
    if (val === "") return "";

    if (val.length < 4) return val;

    const num = parseInt(val, 10);
    if (isNaN(num)) return "";
    if (num < 1970) return 1970;
    return num;
  };

  return (
    <div className="App">
      <Input
        label="Username:"
        type="text"
        value={username}
        setValue={setUsername}
        icon={<FontAwesomeIcon icon={faUser} />}
      />

      <Input
        label="Min Date:"
        type="number"
        value={minDate}
        setValue={setMinDate}
        validateValue={validateMinDate}
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

export default Authentication;
