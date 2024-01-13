import React, { useEffect, useCallback, useState } from 'react';
import DashboardCompo from './programmes/Single_Programmes/DashboardCompo';
import { Users } from './CompoDashCoach/Sous_CompoSideBar/Utils';
import { MdTask } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { PiUsersFourFill } from 'react-icons/pi';
import { collection, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import CardLivraison from '../components/CardLivraison';
import { db } from '../config/firebase-config';

export default function DashboardApprenant() {
  const [livraisons, setLivraisons] = useState([]);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const publicationRef = collection(db, 'publication');
        const querySnapshot = await getDocs(publicationRef);

        const nouvellesLivraisons = [];
        querySnapshot.forEach(async (doc) => {
          const data = doc.data();
          nouvellesLivraisons.push(
            <CardLivraison key={doc.id} images={data.images} />
          );

          await updateDoc(doc.ref, { livree: true });
        });

        setLivraisons(nouvellesLivraisons);
      } catch (error) {
        console.error('Erreur lors de la récupération des livraisons', error);
      }
    };

    fetchLivraisons();
  }, []);

  // L'stockage des utilisateurs récupérés depuis Firestore
  const [users, setUsers] = useState([]);

  // Filtre des utilisateurs par rôle (Coach ou Étudiant)
  const teachers = users.filter((user) => user.role === 'Coach');
  const students = users.filter((user) => user.role === 'Étudiant');

  // Fonction pour charger les utilisateurs depuis Firestore
  const loadUsers = useCallback(() => {
    // Initialisation du listener de snapshot pour la collection 'utilisateurs'
    const unsubscribe = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        // Mettre à jour le state avec les données utilisateur actualisées
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedUsers);
      }
    );

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
  const ContenuCardDsb = [
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
  ]

  return (
    <div className="d-flex flex-column flex-wrap ms-3 justify-content-center">
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Dashboard
      </h1>
      {/* Cartes du dashboard */}
      <div className="d-flex ContaCardDsb justify-content-start">
        {ContenuCardDsb.map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      <div className="d-flex flex-column ms-3 justify-content-center">
        {livraisons}
      </div>
    </div>
  );
}
