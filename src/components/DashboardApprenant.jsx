import React, { useEffect, useCallback, useState, useContext } from 'react';
import DashboardCompo from '../components/programmes/Single_Programmes/DashboardCompo';
import CardLivraison from '../components/CardLivraison';
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { AuthContext } from '../contexte/AuthContext';
import format from 'date-fns/format';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from '../../src/config/firebase-config';
import { getDownloadURL, ref } from 'firebase/storage';
import UserProfil from '../assets/images/user.png';

export default function DashboardApprenant() {
  // État local pour stocker les livraisons et les utilisateurs
  const [livraisons, setLivraisons] = useState([]);
  const [users, setUsers] = useState([]);

  // Extraction des informations actuelles de l'utilisateur
  const { currentUser, uid } = useContext(AuthContext);
  const UserUid = uid;
  const students = users.filter((user) => user.role === 'Étudiant');

  // Effet de chargement initial pour récupérer les livraisons
  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const publicationCollectionRef = collection(db, 'publication');

        // Requête pour récupérer tous les documents de la collection "publication"
        const publicationQuery = query(publicationCollectionRef);
        const querySnapshot = await getDocs(publicationQuery);

        // Tableau pour stocker les nouvelles livraisons
        const nouvellesLivraisons = [];

        // Vérifier si des documents ont été trouvés dans la collection "publication"
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

            // Obtenir le snapshot des résultats de la requête
            const livraisonQuerySnapshot = await getDocs(livraisonQuery);

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
                userProfile: data.profile,
              });
            });
          }

          // Trier les nouvelles livraisons par date décroissante
          nouvellesLivraisons.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          // Mettre à jour l'état local avec les nouvelles livraisons
          setLivraisons(nouvellesLivraisons);
        } else {
          console.log('Aucun document publication trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des livraisons', error);
      }
    };

    // Appeler la fonction pour récupérer les livraisons lors du montage initial
    fetchLivraisons();
  }, []);

  // Fonction de chargement des utilisateurs à partir de la collection "utilisateurs"
  const loadUsers = useCallback(() => {
    // Souscrire aux changements dans la collection "utilisateurs"
    const unsubscribe = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        // Mettre à jour l'état local des utilisateurs avec les données du snapshot
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedUsers);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Contenu des cartes du tableau de bord
  const ContenuCardDsb = [
    {
      ChiffreCardDsb: users.filter((user) => user.role === 'Étudiant').length,
      TextCardDsb: 'Etudiants',
      couleurCarte: 'CouleurB',
    },
    {
      ChiffreCardDsb: '52',
      TextCardDsb: 'Taches',
      couleurCarte: 'CouleurC',
    },
  ];

  // Rendu du composant
  return (
    <div className="d-flex flex-column flex-wrap ms-3 justify-content-center">
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Dashboard
      </h1>
      <div className="d-flex ContaCardDsb justify-content-start">
        {/* Mapping sur le contenu des cartes du tableau de bord */}
        {ContenuCardDsb.map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      <div className="d-flex flex-column ms-3 justify-content-center">
        {/* Mapping sur les livraisons pour afficher les cartes de livraison */}
        {livraisons.map((livraison) => (
          <CardLivraison key={livraison.key} {...livraison} />
        ))}
      </div>
    </div>
  );
}