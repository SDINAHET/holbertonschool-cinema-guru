// // src/components/Dashboard.jsx
// export default function Dashboard({ userUsername }) {
//   return <h1>Welcome, {userUsername}</h1>;
// }

// src/components/Dashboard.jsx
export default function Dashboard({ userUsername }) {
  return (
    <div>
      <h1>Welcome, {userUsername} 👋</h1>
      <p>You are logged in to Cinema Guru.</p>
    </div>
  );
}
