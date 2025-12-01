// src/routes/dashboard/Dashboard.jsx
import './dashboard.css';
import Header from '../../components/navigation/Header';
import SideBar from '../../components/navigation/SideBar';  // ⬅️ IMPORT IMPORTANT

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
    <div className="dashboard-container">
      <Header userUsername={userUsername} setIsLoggedIn={setIsLoggedIn} />

      <SideBar />

      <div className="dashboard-content">
        {/* ton contenu */}
      </div>
    </div>
  );
}

export default Dashboard;

