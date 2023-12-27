import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoWlo96uEOZytiEMN2xqNUyHlGP0c7FOU",
  authDomain: "test-f485d.firebaseapp.com",
  projectId: "test-f485d",
  storageBucket: "test-f485d.appspot.com",
  messagingSenderId: "606951006466",
  appId: "1:606951006466:web:7cf8ab019fd0bb0250e21b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

export { app, db, storage, auth };