import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBudget } from '../contexts/BudgetContext';
import BudgetEditor from '../components/BudgetEditor';

export default function Dashboard() {
  const { user } = useAuth();
  const { budget, loading } = useBudget();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  if (loading) return <p>Loading budget...</p>;
  if (!budget) return <p>No budget found or access denied.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.email}</p>
      <p><strong>Budget ID:</strong> {budget.id}</p>
      <p><strong>Owner:</strong> {budget.owner}</p>
      <p><strong>Shared With:</strong> {budget.allowedUsers.join(', ')}</p>

      <hr style={{ margin: '1.5rem 0' }} />

      <BudgetEditor />

      <hr style={{ margin: '1.5rem 0' }} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
