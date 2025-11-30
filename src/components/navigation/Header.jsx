// src/components/navigation/Header.jsx
import './navigation.css';

function Header({ userUsername, setIsLoggedIn }) {
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('accessToken');
    // Set isLoggedIn to false
    setIsLoggedIn(false);
  };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <img
//           src="https://picsum.photos/100/100"
//           alt="User avatar"
//         />
//         <p className="navbar-welcome">
//           Welcome, {userUsername || 'User'} !
//         </p>
//       </div>

//       <div className="navbar-right">
//         <span className="navbar-logout" onClick={logout}>
//           <span role="img" aria-label="logout">
//             🚪
//           </span>
//           <span>Logout</span>
//         </span>
//       </div>
//     </nav>
//   );
// }
  return (
    <nav className="navbar">
      {/* LEFT SIDE → Title */}
      <div className="navbar-left">
        <h3 className="navbar-title">Cinema Guru</h3>
      </div>

      {/* RIGHT SIDE → Avatar + welcome + logout */}
      <div className="navbar-right">
        <img
          src="https://picsum.photos/100/100"
          alt="User avatar"
          className="navbar-avatar"
        />

        <p className="navbar-welcome">
          Welcome, {userUsername || 'User'}!
        </p>

        <span className="navbar-logout" onClick={logout}>
          <span className="logout-icon">↪</span>
          Logout
        </span>
      </div>
    </nav>
  );
}

export default Header;
