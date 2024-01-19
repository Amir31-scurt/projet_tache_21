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
  const userCoach = roleUser
    ? users.find((user) => user.email === roleUser.emailCoach)
    : null;

  console.log(roleUser, userCoach);
  const studentsWithSameCoach = users.filter(
    (user) => user.emailCoach === userCoach.email
  );

  return (
    <div className="">
      <div className="card-container2 d-flex flex-column mt-5 pt-3 text-center align-items-center justify-content-center gap-1">
        <div className="card-image2">
          <img src={defaultUser} alt="Photo Profile" />
        </div>
        <div className="card-content2 text-center">
          <h2 className="card-title2">{userCoach ? userCoach.name : ''}</h2>
          <p className="card-description2">
            {userCoach ? userCoach.email : ''}
          </p>
          <p className="card-description2 ">
            {userCoach ? userCoach.number : ''}
          </p>
          <p className="card-description2 ">
            {userCoach ? userCoach.domaine : ''}
          </p>
        </div>
      </div>
      <div className="">
        <div className="card-container2 d-flex flex-column mt-5 pt-3 text-center align-items-center justify-content-center gap-1">
          <h3>Groupe</h3>
          <ul className="list-unstyled">
            {studentsWithSameCoach.map((student) => (
              <li className="mb-2" key={student.id}>
                {student.name} &nbsp; {student.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
