import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';

export const fetchAdminEmails = async () => {
  const usersRef = collection(db, 'utilisateurs');
  const adminQuery = query(usersRef, where('role', '==', 'Administrateur'));
  const querySnapshot = await getDocs(adminQuery);
  const adminEmails = [];

  querySnapshot.forEach((doc) => {
    adminEmails.push(doc.data().email); // Assuming the email field is named 'email'
  });

  return adminEmails;
};
