import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: "AIzaSyB11i9eAe_iNYBdOonaoZ6lkIrFf5xMvco",
//   authDomain: "test-23c5e.firebaseapp.com",
//   projectId: "test-23c5e",
//   storageBucket: "test-23c5e.appspot.com",
//   messagingSenderId: "395175751377",
//   appId: "1:395175751377:web:7bc66ba39d4223256a5ff0"
// };
// Bismilah

const firebaseConfig = {
  apiKey: "AIzaSyAkYLY7TMu0ZBoCqT7kXwE1sdnxVC-55uk",
  authDomain: "tache21-82734.firebaseapp.com",
  projectId: "tache21-82734",
  storageBucket: "tache21-82734.appspot.com",
  messagingSenderId: "512673644432",
  appId: "1:512673644432:web:4682f6560a4cb803533d15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentification
export const auth = getAuth()

// Initialize Firestore Services
export const db = getFirestore()

// Initialize Storage Services
export const storage = getStorage()





