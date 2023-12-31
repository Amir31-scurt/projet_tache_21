import React, { createContext, useEffect, useState } from 'react';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  // const [email, setEmail] = useState('');
  const [email, setEmail] = useState(() => {
    const storedEmail = localStorage.getItem('userEmail');
    return storedEmail !== null ? storedEmail : '';
  });

  // Update localStorage when the email state changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
    }
  }, [email]);
  console.log(email);

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};
