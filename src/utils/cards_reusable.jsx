import { collection, onSnapshot } from 'firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import { db } from '../config/firebase-config';
import { EmailContext } from '../contexte/EmailContexte';

export default function Card() {
  const [users, setUsers] = useState([]);
  const {email} = useContext(EmailContext)

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
  const userCoach = users.find((user) => user.email === roleUser.emailCoach)
  console.log(roleUser, userCoach)

  return (
    <div className="program-card2 card bg-light justify-content-center">
      <div className='d-flex justify-content-between '>
     <div className='nicePic'><img src={ userCoach? userCoach.photoURL:'' }/></div> 
     <div>
      <h4>{userCoach ? userCoach.name :''}</h4>
      <h6>{userCoach ? userCoach.email :''}</h6>
      </div>
      </div>
    </div>
  );
}