import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const BUDGET_ID = 'shared-household'; // 👈 or whatever you used in Firestore

  useEffect(() => {
    const fetchBudget = async () => {
      if (!user) {
        setBudget(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'budgets', BUDGET_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.allowedUsers.includes(user.email)) {
            setBudget({ id: docSnap.id, ...data });
          } else {
            console.warn('Access denied: not in allowedUsers');
            setBudget(null);
          }
        } else {
          console.warn('No such budget document!');
          setBudget(null);
        }
      } catch (err) {
        console.error('Error loading budget:', err);
        setBudget(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [user]);

  return (
    <BudgetContext.Provider value={{ budget, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
