// src/components/movies/Filter.jsx
import "./movies.css";
import Tag from "./Tag";

// adapte les chemins si besoin
import SearchBar from "../general/SearchBar";
import SelectInput from "../general/SelectInput";

const ALL_GENRES = [
  "action",
  "drama",
  "comedy",
  "biography",
  "romance",
  "thriller",
  "war",
  "history",
  "sport",
  "sci-fi",
  "documentary",
  "crime",
  "fantasy",
];

/**
 * Props:
 * - minYear, setMinYear
 * - maxYear, setMaxYear
 * - sort, setSort
 * - genres, setGenres
 * - title, setTitle
 */
export default function Filter({
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  sort,
  setSort,
  genres,
  setGenres,
  title,
  setTitle,
}) {
  const handleMinYearChange = (e) => setMinYear(e.target.value);
  const handleMaxYearChange = (e) => setMaxYear(e.target.value);
  const handleSortChange = (e) => setSort(e.target.value);

  return (
    <div className="movies-filter">
      {/* Search bar */}
      <SearchBar title={title} setTitle={setTitle} />

      <div className="movies-filter-row">
        {/* Min year */}
        <input
          type="number"
          placeholder="Min year"
          value={minYear}
          onChange={handleMinYearChange}
        />

        {/* Max year */}
        <input
          type="number"
          placeholder="Max year"
          value={maxYear}
          onChange={handleMaxYearChange}
        />

        {/* Sort select */}
        <SelectInput value={sort} onChange={handleSortChange}>
          <option value="">Sort by</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="highestrated">Highest rated</option>
          <option value="lowestrated">Lowest rated</option>
        </SelectInput>
      </div>

      {/* Tags */}
      <ul className="tag-list">
        {ALL_GENRES.map((g) => (
          <Tag
            key={g}
            genre={g}
            filter
            genres={genres}
            setGenres={setGenres}
          />
        ))}
      </ul>
    </div>
  );
}
