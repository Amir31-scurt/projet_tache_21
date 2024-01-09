import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };



const firebaseConfig = {
  apiKey: "AIzaSyB1U946wmPGFBPfve3K27IEWKCEAcSCUAA",
  authDomain: "project-livre-c9c9c.firebaseapp.com",
  projectId: "project-livre-c9c9c",
  storageBucket: "project-livre-c9c9c.appspot.com",
  messagingSenderId: "256415426328",
  appId: "1:256415426328:web:d4786ab5a61a05ef60606d"
}; 


// const firebaseConfig = {
//   apiKey: "AIzaSyA37NpBE2TbcB75kruIL2LKc3RFEwH5wpI",
//   authDomain: "react-contact-6999f.firebaseapp.com",
//   databaseURL: "https://react-contact-6999f-default-rtdb.firebaseio.com",
//   projectId: "react-contact-6999f",
//   storageBucket: "react-contact-6999f.appspot.com",
//   messagingSenderId: "233706406048",
//   appId: "1:233706406048:web:7fc1d7ead4f07613f409c5"
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { analytics, storage, auth, db };
