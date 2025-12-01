// src/components/movies/MovieCard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";

import "./movies.css";

/**
 * Props:
 * - movie: object (doit contenir au minimum imdbId, title, synopsis, genres[])
 */
export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    if (!movie || !movie.imdbId) return;

    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [favoriteRes, watchLaterRes] = await Promise.all([
          axios.get("http://localhost:8000/api/titles/favorite/", {
            headers,
          }),
          axios.get("http://localhost:8000/api/titles/watchlater/", {
            headers,
          }),
        ]);

        const favorites = favoriteRes.data || [];
        const watchLater = watchLaterRes.data || [];

        const imdbId = movie.imdbId;

        setIsFavorite(favorites.some((m) => m.imdbId === imdbId));
        setIsWatchLater(watchLater.some((m) => m.imdbId === imdbId));
      } catch (err) {
        console.error("Error fetching favorites/watchlater:", err);
      }
    };

    fetchLists();
  }, [movie]);

  const handleClick = async (type) => {
    if (!movie || !movie.imdbId) return;

    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const imdbId = movie.imdbId;

    const currentlySelected =
      type === "favorite" ? isFavorite : isWatchLater;

    const method = currentlySelected ? "delete" : "post";
    const url = `http://localhost:8000/api/titles/${type}/${imdbId}`;

    try {
      await axios({
        method,
        url,
        headers,
      });

      if (type === "favorite") {
        setIsFavorite(!isFavorite);
      } else {
        setIsWatchLater(!isWatchLater);
      }
    } catch (err) {
      console.error(`Error updating ${type} list:`, err);
    }
  };

  const {
    title = "",
    synopsis = "",
    genres = [],
  } = movie || {};

  return (
    <li className="movie-card">
      <div className="movie-card-header">
        {/* Favorite icon */}
        <FontAwesomeIcon
          icon={faStar}
          className={`movie-card-icon ${
            isFavorite ? "movie-card-icon--active" : ""
          }`}
          onClick={() => handleClick("favorite")}
        />

        {/* Watch later icon */}
        <FontAwesomeIcon
          icon={faClock}
          className={`movie-card-icon ${
            isWatchLater ? "movie-card-icon--active" : ""
          }`}
          onClick={() => handleClick("watchlater")}
        />
      </div>

      <h3 className="movie-title">{title}</h3>

      {synopsis && (
        <p className="movie-synopsis">
          {synopsis}
        </p>
      )}

      {Array.isArray(genres) && genres.length > 0 && (
        <ul className="movie-genres">
          {genres.map((g) => (
            <li key={g} className="movie-genre-pill">
              {g}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
