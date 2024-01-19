import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyA37NpBE2TbcB75kruIL2LKc3RFEwH5wpI",
  authDomain: "react-contact-6999f.firebaseapp.com",
  databaseURL: "https://react-contact-6999f-default-rtdb.firebaseio.com",
  projectId: "react-contact-6999f",
  storageBucket: "react-contact-6999f.appspot.com",
  messagingSenderId: "233706406048",
  appId: "1:233706406048:web:7fc1d7ead4f07613f409c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { analytics, storage, auth, db };