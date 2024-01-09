import React, { useEffect, useCallback, useState, useContext } from 'react';
import CardLivraison from './CardLivraison';
import DashboardCompo from './programmes/Single_Programmes/DashboardCompo';
import { Users } from './CompoDashCoach/Sous_CompoSideBar/Utils';
import { MdTask } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { PiUsersFourFill } from 'react-icons/pi';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import {EmailContext} from '../contexte/EmailContexte'
export default function DashboardApprenant() {
  // L'stockage des utilisateurs récupérés depuis Firestore
  const [users, setUsers] = useState([]);
  const {email} = useContext(EmailContext)

  // Filtre des utilisateurs par rôle (Coach ou Étudiant)
  const teachers = users.filter((user) => user.role === "Coach");
  const students = users.filter((user) => user.role === "Étudiant");
  const userRole = users.find((user) => user.email === email);

  // Fonction pour charger les utilisateurs depuis Firestore
  const loadUsers = useCallback(() => {
    // Initialisation du listener de snapshot pour la collection 'utilisateurs'
    const unsubscribe = onSnapshot(collection(db, 'utilisateurs'), (snapshot) => {
      // Mettre à jour le state avec les données utilisateur actualisées
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(updatedUsers);
    });

    // Nettoyage de listener lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, []); 

  // Utilisation useEffect pour appeler loadUsers lors du montage du composant
  useEffect(() => {
    loadUsers();
  }, [loadUsers]); 

  // Données pour les cartes du dashboard

  const contentCard = () =>{
    const ContenuCardDsb = [];
    if(userRole && userRole.role === "Coach"){
      ContenuCardDsb.push({
        ChiffreCardDsb: teachers.length,
        IconeCardDsb: (
          <FaUsers style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
        ),
        TextCardDsb: 'Professeurs',
        couleurCarte: 'CouleurA',
      },
      {
        ChiffreCardDsb: students.length,
        IconeCardDsb: (
          <PiUsersFourFill
            style={{ fontSize: '68px', opacity: '1', color: '#fff' }}
          />
        ),
        TextCardDsb: 'Etudiants',
        couleurCarte: 'CouleurB',
      },)
    }else{
      ContenuCardDsb.push(
        {
        ChiffreCardDsb: teachers.length,
        IconeCardDsb: (
          <FaUsers style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
        ),
        TextCardDsb: 'Professeurs',
        couleurCarte: 'CouleurA',
      },
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
        ChiffreCardDsb: '52',
        IconeCardDsb: (
          <MdTask style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
        ),
        TextCardDsb: 'Taches',
        couleurCarte: 'CouleurC',
      },)
    }

    return ContenuCardDsb;
  }
  const ContenuCardDsb = [
    {
      ChiffreCardDsb: teachers.length,
      IconeCardDsb: (
        <FaUsers style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
      ),
      TextCardDsb: 'Professeurs',
      couleurCarte: 'CouleurA',
    },
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
      ChiffreCardDsb: '52',
      IconeCardDsb: (
        <MdTask style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />
      ),
      TextCardDsb: 'Taches',
      couleurCarte: 'CouleurC',
    },
  ];
  return (
    <div className="d-flex flex-column flex-wrap ms-3 justify-content-center">
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Dashboard
      </h1>
      {/* Cartes du dashboard */}
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
