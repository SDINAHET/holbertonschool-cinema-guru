// // src/components/movies/MovieCard.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";

// import "./movies.css";

// /**
//  * Props:
//  * - movie: object (doit contenir au minimum imdbId, title, synopsis, genres[])
//  */
// export default function MovieCard({ movie }) {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isWatchLater, setIsWatchLater] = useState(false);

//   useEffect(() => {
//     if (!movie || !movie.imdbId) return;

//     const fetchLists = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const headers = token ? { Authorization: `Bearer ${token}` } : {};

//         const [favoriteRes, watchLaterRes] = await Promise.all([
//           axios.get("http://localhost:8000/api/titles/favorite/", {
//             headers,
//           }),
//           axios.get("http://localhost:8000/api/titles/watchlater/", {
//             headers,
//           }),
//         ]);

//         const favorites = favoriteRes.data || [];
//         const watchLater = watchLaterRes.data || [];

//         const imdbId = movie.imdbId;

//         setIsFavorite(favorites.some((m) => m.imdbId === imdbId));
//         setIsWatchLater(watchLater.some((m) => m.imdbId === imdbId));
//       } catch (err) {
//         console.error("Error fetching favorites/watchlater:", err);
//       }
//     };

//     fetchLists();
//   }, [movie]);

//   const handleClick = async (type) => {
//     if (!movie || !movie.imdbId) return;

//     const token = localStorage.getItem("accessToken");
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     const imdbId = movie.imdbId;

//     const currentlySelected =
//       type === "favorite" ? isFavorite : isWatchLater;

//     const method = currentlySelected ? "delete" : "post";
//     const url = `http://localhost:8000/api/titles/${type}/${imdbId}`;

//     try {
//       await axios({
//         method,
//         url,
//         headers,
//       });

//       if (type === "favorite") {
//         setIsFavorite(!isFavorite);
//       } else {
//         setIsWatchLater(!isWatchLater);
//       }
//     } catch (err) {
//       console.error(`Error updating ${type} list:`, err);
//     }
//   };

//   const {
//     title = "",
//     synopsis = "",
//     genres = [],
//   } = movie || {};

//   return (
//     <li className="movie-card">
//       <div className="movie-card-header">
//         {/* Favorite icon */}
//         <FontAwesomeIcon
//           icon={faStar}
//           className={`movie-card-icon ${
//             isFavorite ? "movie-card-icon--active" : ""
//           }`}
//           onClick={() => handleClick("favorite")}
//         />

//         {/* Watch later icon */}
//         <FontAwesomeIcon
//           icon={faClock}
//           className={`movie-card-icon ${
//             isWatchLater ? "movie-card-icon--active" : ""
//           }`}
//           onClick={() => handleClick("watchlater")}
//         />
//       </div>

//       <h3 className="movie-title">{title}</h3>

//       {synopsis && (
//         <p className="movie-synopsis">
//           {synopsis}
//         </p>
//       )}

//       {Array.isArray(genres) && genres.length > 0 && (
//         <ul className="movie-genres">
//           {genres.map((g) => (
//             <li key={g} className="movie-genre-pill">
//               {g}
//             </li>
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// }

// // src/components/movies/MovieCard.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./movies.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";
// // importe ton image "unavailable" dans assets
// import unavailablePoster from "../../assets/unavailable1.png";

// export default function MovieCard({ movie }) {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isWatchLater, setIsWatchLater] = useState(false);

//   const {
//     imdbId,
//     title,
//     synopsis,
//     imageurls,
//     genres,
//   } = movie;

//   const poster =
//     Array.isArray(imageurls) && imageurls.length
//       ? imageurls[0]
//       : unavailablePoster;

//   // 💾 on vérifie si ce film est dans les favoris / watchlater
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (!token || !imdbId) return;

//     const headers = { Authorization: `Bearer ${token}` };

//     const fetchStatus = async () => {
//       try {
//         const [favRes, watchRes] = await Promise.all([
//           axios.get("http://localhost:8000/api/titles/favorite", { headers }),
//           axios.get("http://localhost:8000/api/titles/watchlater", { headers }),
//         ]);

//         const favList = favRes.data || [];
//         const watchList = watchRes.data || [];

//         setIsFavorite(favList.some((m) => m.imdbId === imdbId));
//         setIsWatchLater(watchList.some((m) => m.imdbId === imdbId));
//       } catch (err) {
//         console.error("Error checking movie status", err);
//       }
//     };

//     fetchStatus();
//   }, [imdbId]);

//   const handleClick = async (type) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) return;
//       const headers = { Authorization: `Bearer ${token}` };

//       const url = `http://localhost:8000/api/titles/${type}/${imdbId}`;

//       if (type === "favorite") {
//         if (isFavorite) {
//           await axios.delete(url, { headers });
//           setIsFavorite(false);
//         } else {
//           await axios.post(url, null, { headers });
//           setIsFavorite(true);
//         }
//       } else if (type === "watchlater") {
//         if (isWatchLater) {
//           await axios.delete(url, { headers });
//           setIsWatchLater(false);
//         } else {
//           await axios.post(url, null, { headers });
//           setIsWatchLater(true);
//         }
//       }
//     } catch (err) {
//       console.error("Error updating movie status", err);
//     }
//   };

//   return (
//     <li className="movie-card">
//       <div className="movie-card-image-wrapper">
//         <img className="movie-card-image" src={poster} alt={title} />
//         <div className="movie-card-actions">
//           <FontAwesomeIcon
//             icon={faStar}
//             className={`movie-card-icon ${isFavorite ? "active" : ""}`}
//             onClick={() => handleClick("favorite")}
//           />
//           <FontAwesomeIcon
//             icon={faClock}
//             className={`movie-card-icon ${isWatchLater ? "active" : ""}`}
//             onClick={() => handleClick("watchlater")}
//           />
//         </div>
//       </div>

//       <div className="movie-card-body">
//         <h3 className="movie-card-title">{title}</h3>
//         {synopsis && (
//           <p className="movie-card-synopsis">
//             {synopsis}
//           </p>
//         )}

//         <div className="movie-card-genres">
//           {Array.isArray(genres) &&
//             genres.map((g) => (
//               <span key={g} className="movie-card-genre-tag">
//                 {g.toLowerCase()}
//               </span>
//             ))}
//         </div>
//       </div>
//     </li>
//   );
// }

// src/components/movies/MovieCard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";
import unavailablePoster from "../../assets/unavailable1.png";

const API_BASE = "http://localhost:8000";

export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  const { imdbId, title, synopsis, imageurls, genres } = movie;

  const poster =
    Array.isArray(imageurls) && imageurls.length
      ? imageurls[0]
      : unavailablePoster;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !imdbId) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchStatus = async () => {
      try {
        const [favRes, watchRes] = await Promise.all([
          axios.get(`${API_BASE}/api/titles/favorite`, { headers }),
          axios.get(`${API_BASE}/api/titles/watchLater`, { headers }),
        ]);

        const favList = favRes.data || [];
        const watchList = watchRes.data || [];

        setIsFavorite(favList.some((m) => m.imdbId === imdbId));
        setIsWatchLater(watchList.some((m) => m.imdbId === imdbId));
      } catch (err) {
        console.error("Error checking favorite/watchLater:", err);
      }
    };

    fetchStatus();
  }, [imdbId]);

  const handleClick = async (type) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const url = `${API_BASE}/api/titles/${type}/${imdbId}`;

      if (type === "favorite") {
        if (isFavorite) {
          await axios.delete(url, { headers });
          setIsFavorite(false);
        } else {
          await axios.post(url, null, { headers });
          setIsFavorite(true);
        }
      } else if (type === "watchLater") {
        if (isWatchLater) {
          await axios.delete(url, { headers });
          setIsWatchLater(false);
        } else {
          await axios.post(url, null, { headers });
          setIsWatchLater(true);
        }
      }
    } catch (err) {
      console.error("Error updating movie:", err);
    }
  };

  return (
    <li className="movie-card">
      <div className="movie-card-image-wrapper">
        <img className="movie-card-image" src={poster} alt={title} />
        <div className="movie-card-actions">
          <FontAwesomeIcon
            icon={faStar}
            className={`movie-card-icon ${isFavorite ? "active" : ""}`}
            onClick={() => handleClick("favorite")}
          />
          <FontAwesomeIcon
            icon={faClock}
            className={`movie-card-icon ${isWatchLater ? "active" : ""}`}
            onClick={() => handleClick("watchLater")}
          />
        </div>
      </div>

      <div className="movie-card-body">
        <h3 className="movie-card-title">{title}</h3>
        {synopsis && <p className="movie-card-synopsis">{synopsis}</p>}

        <div className="movie-card-genres">
          {Array.isArray(genres) &&
            genres.map((g) => (
              <span key={g} className="movie-card-genre-tag">
                {g}
              </span>
            ))}
        </div>
      </div>
    </li>
  );
}
