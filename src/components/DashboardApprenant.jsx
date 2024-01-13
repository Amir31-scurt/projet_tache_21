import React, { useEffect, useCallback, useState, useContext } from 'react';
import DashboardCompo from './programmes/Single_Programmes/DashboardCompo';
import CardLivraison from '../components/CardLivraison';
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { AuthContext } from '../contexte/AuthContext';
import format from 'date-fns/format';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from '../../src/config/firebase-config';
import { getDownloadURL, ref } from 'firebase/storage';
import UserProfil from '../assets/images/user.png';
import { MdTask } from 'react-icons/md';
import { PiUsersFourFill } from 'react-icons/pi';

export default function DashboardApprenant() {
  const [livraisons, setLivraisons] = useState([]);
  const [users, setUsers] = useState([]);

  // Extraction des informations actuelles de l'utilisateur
  const { currentUser, uid } = useContext(AuthContext);
  const UserUid = uid;
  const [profileImage, setProfileImage] = useState(UserProfil);
  // Utilisez useEffect pour mettre à jour l'image de profil après la reconnexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mettez à jour l'image de profil après la reconnexion
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        getDownloadURL(storageRef)
          .then((url) => {
            setProfileImage(url);
            localStorage.setItem('profileImage', url);
          })
          .catch((error) => {
            console.error('Error loading profile image:', error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const publicationCollectionRef = collection(db, 'publication');

        // Requête pour récupérer tous les documents de la collection "publication"
        const publicationQuery = query(publicationCollectionRef);
        console.log(publicationQuery);
        const querySnapshot = await getDocs(publicationQuery);

        const nouvellesLivraisons = [];

        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            // Extraire le cours de l'utilisateur actuel
            const userCours = doc.data().cours;

            // Référence à la collection "publication" pour les livraisons
            const livraisonCollectionRef = collection(db, 'publication');

            // Requête pour récupérer les livraisons liées au cours de l'utilisateur actuel
            const livraisonQuery = query(
              livraisonCollectionRef,
              where('cours', '==', userCours)
            );
            console.log(livraisonQuery);

            // Obtenir le snapshot des résultats de la requête
            const livraisonQuerySnapshot = await getDocs(livraisonQuery);
            console.log(livraisonQuerySnapshot);

            // Parcourir les livraisons récupérées et les ajouter au tableau nouvellesLivraisons
            livraisonQuerySnapshot.forEach((livraisonDoc) => {
              const data = livraisonDoc.data();
              nouvellesLivraisons.push({
                key: livraisonDoc.id,
                date: format(
                  new Date(data.date.seconds * 1000),
                  'dd/MM/yyyy - HH:mm:ss'
                ),
                apprenant: data.nom,
                titreCourEtudiant: data.cours,
                images: data.images || [],
                userProfile: profileImage,
              });
              console.log(data);
            });
          }

          // Trier les nouvelles livraisons par date décroissante
          nouvellesLivraisons.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          // Mettre à jour l'état local avec les nouvelles livraisons
          setLivraisons(nouvellesLivraisons);
          console.log(livraisons);
        } else {
          console.log('Aucun document publication trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des livraisons', error);
      }
    };

    fetchLivraisons();
  }, []);

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
  ];

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
        {livraisons.map((livraison) => (
          <CardLivraison key={livraison.key} {...livraison} />
        ))}
      </div>
    </div>
  );
}
