// src/pages/Dashboard.jsx
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth(); // 👈 get user from context
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.email}</p> {/* 👈 Display user email */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
