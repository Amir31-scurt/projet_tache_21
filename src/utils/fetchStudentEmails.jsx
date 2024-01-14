import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';

 // eslint-disable-next-line
export const fetchStudentEmails = async () => {
  const usersRef = collection(db, 'utilisateurs');
  const studentQuery = query(usersRef, where('role', '==', 'Étudiant'));
  const querySnapshot = await getDocs(studentQuery);
  const studentEmails = [];

  querySnapshot.forEach((doc) => {
    studentEmails.push(doc.data().email); // Assuming the email field is named 'email'
  });

  return studentEmails;
};
