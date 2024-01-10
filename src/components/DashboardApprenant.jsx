import React, { useEffect, useCallback, useState, useContext } from 'react';
import CardLivraison from './CardLivraison';
import DashboardCompo from './programmes/Single_Programmes/DashboardCompo';
import { MdTask } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { PiUsersFourFill } from 'react-icons/pi';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { EmailContext } from '../contexte/EmailContexte';

export default function DashboardApprenant() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const { email } = useContext(EmailContext);

  const loadUserData = useCallback(async () => {
  try {
    // Récupérer les utilisateurs
    const usersSnapshot = await getDocs(collection(db, 'utilisateurs'));
    const updatedUsers = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(updatedUsers);

    console.log('Utilisateurs récupérés :', updatedUsers);

    // Récupérer les cours
    const coursesSnapshot = await getDocs(collection(db, 'cours'));
    const updatedCourses = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(updatedCourses);

    console.log('Cours récupérés :', updatedCourses);
  } catch (error) {
    console.error('Erreur lors du chargement des données : ', error);
  }
}, []);


  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const teachers = users.filter((user) => user.role === 'Coach');
  const students = users.filter((user) => user.role === 'Étudiant');
  const userRole = users.find((user) => user.email === email);

  const contentCard = () => {
    const ContenuCardDsb = [];
    if (userRole && userRole.role === 'Coach') {
      ContenuCardDsb.push({
        ChiffreCardDsb: teachers.length,
        IconeCardDsb: (
          <FaUsers style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
        ),
        TextCardDsb: 'Professeurs',
        couleurCarte: 'CouleurA',
      });
    } else {
      ContenuCardDsb.push(
        {
          ChiffreCardDsb: students.length,
          IconeCardDsb: (
            <PiUsersFourFill
              style={{ fontSize: '68px', opacity: '1', color: '#fff' }}
            />
          ),
          TextCardDsb: 'Etudiants',
          couleurCarte: 'CouleurB',
        },
        {
          ChiffreCardDsb: courses.length,
          IconeCardDsb: (
            <MdTask style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
          ),
          TextCardDsb: 'Cours',
          couleurCarte: 'CouleurC',
        }
      );
    }

    return ContenuCardDsb;
  };

  return (
    <div className="d-flex flex-column flex-wrap ms-3 justify-content-center">
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Dashboard
      </h1>
      <div className="d-flex ContaCardDsb justify-content-start">
        {contentCard().map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
    </div>
  );
}
