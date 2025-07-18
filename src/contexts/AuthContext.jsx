// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not signed in, undefined = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook
export const useAuth = () => useContext(AuthContext);
