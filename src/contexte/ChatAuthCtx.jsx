import { onAuthStateChanged } from "@firebase/auth";
import React, { useState, useEffect, createContext } from "react";
import { auth } from "../config/firebase-config";

export const ChatAuthCtx = createContext();

export const ChatAuthCtxProvider = ({ children }) => {
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
    <ChatAuthCtx.Provider value={{ currentUser }}>
      {children}
    </ChatAuthCtx.Provider>
  );
};
