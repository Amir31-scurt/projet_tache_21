import { onAuthStateChanged } from '@firebase/auth';
import React, { useState, useEffect, createContext } from 'react';
import { auth } from '../config/firebase-config';

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ currentUser, uid: currentUser ? currentUser.uid : null, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
