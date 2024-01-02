import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';

export const fetchCoachEmails = async () => {
  const usersRef = collection(db, 'utilisateurs');
  const coachQuery = query(usersRef, where('role', '==', 'Coach'));
  const querySnapshot = await getDocs(coachQuery);
  const coachEmails = [];

  querySnapshot.forEach((doc) => {
    coachEmails.push(doc.data().email); // Assuming the email field is named 'email'
  });

  return coachEmails;
};
