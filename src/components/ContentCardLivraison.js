import React, { useState, useEffect, useContext } from 'react';
import CardLivraison from './CompoDashCoach/CardLivraison';
import FilterStudents from './CompoDashCoach/FiterStudents';
import { EmailContext } from '../contexte/EmailContexte';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase-config';

function ContentCardLivraison() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);

  useEffect(() => {
    const usersStudentsUnsub = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedStudents);
      }
    );

    return () => {
      usersStudentsUnsub(); // Clean up the listener
    };
  }, []); // Removed roleUser from the dependency array

  // Move the roleUser derivation inside the component body
  const roleUser = users.find((user) => user.email === email);

  return (
    <div>
      {roleUser && roleUser.role === 'Coach' ? <FilterStudents /> : ''}
      <div className='d-flex justify-content-center  flex-wrap'>
        <CardLivraison role={roleUser}/>
        <CardLivraison />
        <CardLivraison />
      </div>
    </div>
  );
}

export default ContentCardLivraison;
