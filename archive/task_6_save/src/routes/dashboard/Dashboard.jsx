// src/routes/dashboard/Dashboard.jsx
import './dashboard.css';
import Header from '../../components/navigation/Header';

function Dashboard({ userUsername, setIsLoggedIn }) {
  return (
    <div className="dashboard-container">
      <Header
        userUsername={userUsername}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* You can add more dashboard content here later */}
      <h1>Dashboard</h1>
      <p>Welcome to Cinema Guru dashboard.</p>
    </div>
  );
}

export default Dashboard;
