import { useState, useEffect } from 'react';
import { auth } from '../config/firebase-config';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []); 
  return { user };
};

export default useAuth;
