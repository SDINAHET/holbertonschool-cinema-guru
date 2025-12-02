// export default function HomePage() {
//   return <h1>Home Page</h1>;
// }

// // src/routes/dashboard/HomePage.jsx (ou là où est ton composant)
// import { useState } from "react";
// import Filter from "../../components/movies/Filter";
// import MovieCard from "../../components/movies/MovieCard";

// // TEMP : quelques films de test (tu remplaceras plus tard par les vrais depuis l’API)
// const DUMMY_MOVIES = [
//   {
//     imdbId: "tt0000001",
//     title: "Divine Mercenary",
//     synopsis: "A dark tale of redemption.",
//     genres: ["action", "drama"],
//   },
//   {
//     imdbId: "tt0000002",
//     title: "Equally Friends",
//     synopsis: "A touching story about friendship.",
//     genres: ["comedy", "romance"],
//   },
// ];

// export default function HomePage() {
//   // états demandés par le sujet pour Filter
//   const [minYear, setMinYear] = useState("");
//   const [maxYear, setMaxYear] = useState("");
//   const [sort, setSort] = useState("");
//   const [genres, setGenres] = useState([]);  // utilisé par Tag / Filter
//   const [title, setTitle] = useState("");

//   // pour l’instant on affiche des films de test
//   const [movies] = useState(DUMMY_MOVIES);

//   return (
//     <div className="dashboard-page">
//       {/* FILTRE (search bar + min/max + sort + tags) */}
//       <Filter
//         minYear={minYear}
//         setMinYear={setMinYear}
//         maxYear={maxYear}
//         setMaxYear={setMaxYear}
//         sort={sort}
//         setSort={setSort}
//         genres={genres}
//         setGenres={setGenres}
//         title={title}
//         setTitle={setTitle}
//       />

//       {/* LISTE DE FILMS */}
//       <ul className="movies-list">
//         {movies.map((movie) => (
//           <MovieCard key={movie.imdbId} movie={movie} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// src/routes/dashboard/HomePage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "../../components/movies/Filter";
import MovieCard from "../../components/movies/MovieCard";

export default function HomePage() {
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [sort, setSort] = useState("");
  const [genres, setGenres] = useState([]);  // vient des <Tag>
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 à chaque changement de filtre, on recharge la liste
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          "http://localhost:8000/api/titles/advencedsearch",
          {
            signal: controller.signal,
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
            params: {
              title: title || undefined,
              minYear: minYear || undefined,
              maxYear: maxYear || undefined,
              sort: sort || undefined,
              // ex: "action,drama,comedy"
              genres: genres.length ? genres.join(",") : undefined,
            },
          }
        );

        console.log("Movies from backend =>", res.data);
        setMovies(res.data || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching movies:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [title, minYear, maxYear, sort, genres]);

  return (
    <div className="dashboard-page">
      <Filter
        minYear={minYear}
        setMinYear={setMinYear}
        maxYear={maxYear}
        setMaxYear={setMaxYear}
        sort={sort}
        setSort={setSort}
        genres={genres}
        setGenres={setGenres}
        title={title}
        setTitle={setTitle}
      />

      {loading && <p style={{ color: "#fff" }}>Loading...</p>}

      <ul className="movies-list">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbId} movie={movie} />
        ))}
      </ul>
    </div>
  );
}

// // src/routes/dashboard/HomePage.jsx
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Filter from "../../components/movies/Filter";
// import MovieCard from "../../components/movies/MovieCard";

// const API_BASE = "http://localhost:8000";

// export default function HomePage() {
//   const [minYear, setMinYear] = useState("");
//   const [maxYear, setMaxYear] = useState("");
//   const [sort, setSort] = useState("");
//   const [genres, setGenres] = useState([]);
//   const [title, setTitle] = useState("");
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔁 recharge les films quand un filtre change
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchMovies = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("accessToken");

//         const res = await axios.get(`${API_BASE}/api/titles/advancedsearch`, {
//           signal: controller.signal,
//           headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//           params: {
//             title: title || undefined,
//             minYear: minYear || undefined,
//             maxYear: maxYear || undefined,
//             sort: sort || undefined,
//             genres: genres.length ? genres.join(",") : undefined,
//           },
//         });

//         console.log("Movies from backend =>", res.data);
//         setMovies(res.data || []);
//       } catch (err) {
//         if (err.name !== "CanceledError") {
//           console.error("Error fetching movies:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMovies();

//     return () => controller.abort();
//   }, [title, minYear, maxYear, sort, genres]);

//   return (
//     <div className="dashboard-page">
//       <Filter
//         minYear={minYear}
//         setMinYear={setMinYear}
//         maxYear={maxYear}
//         setMaxYear={setMaxYear}
//         sort={sort}
//         setSort={setSort}
//         genres={genres}
//         setGenres={setGenres}
//         title={title}
//         setTitle={setTitle}
//       />

//       {loading && <p style={{ color: "#fff" }}>Loading...</p>}

//       <ul className="movies-list">
//         {movies.map((movie) => (
//           <MovieCard key={movie.imdbId} movie={movie} />
//         ))}
//       </ul>
//     </div>
//   );
// }
