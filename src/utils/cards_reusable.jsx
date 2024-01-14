import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { EmailContext } from '../contexte/EmailContexte';
import defaultUser from '../assets/images/Big.png';

export default function Card() {
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

  const roleUser = users.find((user) => user.email === email);
  const userCoach = users.find((user) => user.email === roleUser.emailCoach);
  console.log(roleUser, userCoach);

  return (
    <div className="card-container2 d-flex flex-column mt-5 pt-3 text-center align-items-center justify-content-center gap-2">
      <h2>Coach</h2>
      <div className="card-image2">
        <img src={defaultUser} alt="Photo Profile" />
      </div>
      <div className="card-content2">
        <h2 className="card-title2">{userCoach ? userCoach.name : ''}</h2>
        <p className="card-description2">{userCoach ? userCoach.email : ''}</p>
      </div>
    </div>
  );
}
