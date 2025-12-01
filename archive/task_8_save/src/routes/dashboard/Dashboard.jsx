// src/routes/dashboard/Dashboard.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import './dashboard.css';
import Header from '../../components/navigation/Header';
import SideBar from '../../components/navigation/SideBar';  // ⬅️ IMPORT IMPORTANT


// Ces composants seront créés dans les tâches suivantes
import HomePage from "./HomePage";
import Favorites from "./Favorites";
import WatchLater from "./WatchLater";

function Dashboard({ userUsername, setIsLoggedIn }) {
  return (
    // <div className="dashboard-container">
    //   <Header
    //     userUsername={userUsername}
    //     setIsLoggedIn={setIsLoggedIn}
    //   />

    //   {/* You can add more dashboard content here later */}
    //   <h1>Dashboard</h1>
    //   <p>Welcome to Cinema Guru dashboard.</p>
    // </div>
    // <div className="dashboard-container">
    //   <Header userUsername={userUsername} setIsLoggedIn={setIsLoggedIn} />

    //   <SideBar />

    //   <div className="dashboard-content">
    //     {/* ton contenu */}
    //   </div>
    // </div>
    <BrowserRouter>
      <div className="dashboard-container">

        {/* Header */}
        <Header
          userUsername={userUsername}
          setIsLoggedIn={setIsLoggedIn}
        />

        {/* Sidebar */}
        <SideBar />

        {/* Routing zone */}
        <div className="dashboard-content">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlater" element={<WatchLater />} />

            {/* Redirection pour toutes les autres routes */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default Dashboard;

