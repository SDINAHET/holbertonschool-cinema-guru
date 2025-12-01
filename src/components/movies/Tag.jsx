// src/components/movies/Tag.jsx
import { useState } from "react";
import "./movies.css";

/**
 * Props:
 * - genre: string
 * - filter: boolean
 * - genres: array        // currently selected genres
 * - setGenres: function  // setter for genres
 */
export default function Tag({ genre, filter, genres, setGenres }) {
  // Local visual state (selected from props)
  const [selected, setSelected] = useState(genres.includes(genre));

  const handleTag = () => {
    if (selected) {
      // Remove from genres
      setGenres((prev) => prev.filter((g) => g !== genre));
      setSelected(false);
    } else {
      // Add to genres
      setGenres((prev) => [...prev, genre]);
      setSelected(true);
    }
  };

  return (
    <li
      className={`tag ${filter ? "tag-filter" : ""} ${
        selected ? "tag-selected" : ""
      }`}
      onClick={handleTag}
    >
      {genre}
    </li>
  );
}
