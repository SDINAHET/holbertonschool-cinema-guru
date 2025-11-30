// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
// import Authentication from "./components/Authentication";
// import Dashboard from "./components/Dashboard"; // si pas encore créé, mets un stub
import Dashboard from "./routes/dashboard/Dashboard";
import Authentication from "./routes/auth/Authentication";

// Petit Dashboard temporaire (en attendant la vraie tâche Dashboard)
// function Dashboard({ userUsername }) {
//   return (
//     <div>
//       <h1>Welcome, {userUsername} 👋</h1>
//       <p>You are logged in to Cinema Guru.</p>
//     </div>
//   );
// }

function App() {
  // États demandés par la consigne
  const [isLoggedInBoolean, setIsLoggedInBoolean] = useState(false);
  const [userUsernamestring, setUserUsernamestring] = useState("");

  // URL du backend (Docker sur 8000)
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // Si pas de token → on garde les valeurs par défaut (non connecté)
    if (!accessToken) {
      return;
    }

    // Vérification du token auprès du backend
    axios
      .post(
        `${API_BASE_URL}/api/auth/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        // on suppose que le backend renvoie { username: "..." }
        const { username } = response.data;
        setIsLoggedInBoolean(true);
        setUserUsernamestring(username || "");
      })
      .catch((error) => {
        console.error("Erreur d'authentification :", error);
        // Token invalide / expiré → on déconnecte
        setIsLoggedInBoolean(false);
        setUserUsernamestring("");
      });
  }, []); // se lance une seule fois au montage

  // Affichage conditionnel selon isLoggedInBoolean
  if (isLoggedInBoolean) {
    return <Dashboard
      userUsername={userUsernamestring}
      setIsLoggedIn={setIsLoggedInBoolean}
      />;
  }

  // return <Authentication />;

  // If not logged in -> show Authentication screen
  return (
    <Authentication
      setIsLoggedIn={setIsLoggedInBoolean}
      setUserUsername={setUserUsernamestring}
    />
  );
}

export default App;
