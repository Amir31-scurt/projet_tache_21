import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB11i9eAe_iNYBdOonaoZ6lkIrFf5xMvco",
  authDomain: "test-23c5e.firebaseapp.com",
  projectId: "test-23c5e",
  storageBucket: "test-23c5e.appspot.com",
  messagingSenderId: "395175751377",
  appId: "1:395175751377:web:7bc66ba39d4223256a5ff0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentification
export const auth = getAuth()

// Initialize Firestore Services
export const db = getFirestore()

// Initialize Storage Services
export const storage = getStorage()





