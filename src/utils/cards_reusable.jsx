import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase-config';
import { EmailContext } from '../contexte/EmailContexte';
import defaultUser from '../assets/images/Big.png';

export default function Card() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);

  useEffect(() => {
    // Utilisation de la fonction onSnapshot pour écouter les modifications dans la collection 'utilisateurs'
    const usersStudentsUnsub = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        // Mise à jour de l'état 'users' avec les données de la collection
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedStudents);
      }
    );

    // Nettoyer le listener lors du démontage du composant
    return () => {
      usersStudentsUnsub();
    };
  }, []); // Le tableau vide assure que le code à l'intérieur du useEffect ne s'exécute qu'une seule fois lors du montage du composant

  // Récupération de l'utilisateur avec l'email actuel
  const roleUser = users.find((user) => user.email === email);

  // Récupération du coach de l'utilisateur actuel
  const userCoach = users.find((user) => user.email === (roleUser ? roleUser.emailCoach : ''));

  // Filtrage des étudiants ayant le même coach que l'utilisateur actuel
  const studentsWithSameCoach = users.filter(
    (user) => user.emailCoach === (userCoach ? userCoach.email : '')
  );

  return (
    <div className="">
      <div className="program-card2 card bg-white shadow-sm justify-content-center">
        <div className='d-flex justify-content-between '>
          <div className='nicePic'>
            {/* Utilisation de l'opérateur de coalescence nulle pour éviter les erreurs si userCoach est null */}
            <img src={userCoach?.photoURL || defaultUser} alt='photoURL Coach' />
          </div>
          <div>
            <h4>{userCoach ? userCoach.name : ''}</h4>
            <h6>{userCoach ? userCoach.email : ''}</h6>
          </div>
          <div className="card-content2 text-start">
            <h2 className="card-title2">
              Coach: {userCoach ? userCoach.name : ''}
            </h2>
            <p className="card-description2">
              <strong>Email:</strong> {userCoach ? userCoach.email : ''}
            </p>
            <p className="card-description2 ">
              <strong>Téléphone:</strong> {userCoach ? userCoach.number : ''}
            </p>
            <p className="card-description2 ">
              <strong>Domaine:</strong> {userCoach ? userCoach.domaine : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="program-card2 card bg-white shadow-sm justify-content-center">
        <div className=' '>
          <h3>Groupe</h3>
          <ul className='list-unstyled'>
            {studentsWithSameCoach.map((student) => (
              <li className='mb-2' key={student.id}>{student.name} &nbsp; {student.email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
