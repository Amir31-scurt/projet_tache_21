import React, { useEffect, useCallback, useState, useContext } from 'react';
import DashboardCompo from '../components/programmes/Single_Programmes/DashboardCompo';
import CardLivraison from '../components/CardLivraison';
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { AuthContext } from '../contexte/AuthContext';
import format from 'date-fns/format';
import { MdTask } from 'react-icons/md';
import { PiUsersFourFill } from 'react-icons/pi';
import { toast } from 'react-toastify';

export default function DashboardApprenant() {
  // État local pour stocker les livraisons et les utilisateurs
  const [livraisons, setLivraisons] = useState([]);
  const [users, setUsers] = useState([]);

  // Fonction pour mettre à jour la description dans la base de données
  const handleUpdateDescription = async (livraisonId, newDescription) => {
    try {
      const livraisonDocRef = doc(db, 'publication', livraisonId);
      await updateDoc(livraisonDocRef, {
        description: newDescription, // Mettre à jour la description avec la nouvelle valeur
      });

      toast.success('Description mise à jour avec succès !', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la description :', error);
      toast.error('Erreur lors de la mise à jour de la description');
    }
  };

  const handleDeleteLivraison = async (livraisonId) => {
    try {
      const livraisonDocRef = doc(db, 'publication', livraisonId);
      const livraisonDocSnapshot = await getDoc(livraisonDocRef);

      if (livraisonDocSnapshot.exists()) {
        const livraisonData = livraisonDocSnapshot.data();

        if (livraisonData.images && livraisonData.images.length > 0) {
          await updateDoc(livraisonDocRef, {
            images: [], // Supprimer toutes les images
          });

          setLivraisons((prevLivraisons) =>
            prevLivraisons.filter((liv) => liv.key !== livraisonId)
          );
          toast.success('Livraison supprimée !', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la livraison', error);
    }
  };

  const { uid } = useContext(AuthContext);
  const UserUid = uid;
  const students = users.filter((user) => user.role === 'Étudiant');

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const publicationCollectionRef = collection(db, 'publication');
        const publicationQuery = query(publicationCollectionRef);
        const querySnapshot = await getDocs(publicationQuery);

        // Utiliser un ensemble pour stocker les identifiants uniques des livraisons
        const uniqueLivraisons = new Set();

        // Tableau pour stocker les nouvelles livraisons
        const nouvellesLivraisons = [];

        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            const userCours = doc.data().cours;
            const livraisonCollectionRef = collection(db, 'publication');

            const livraisonQuery = query(
              livraisonCollectionRef,
              where('cours', '==', userCours)
            );

            const livraisonQuerySnapshot = await getDocs(livraisonQuery);

            livraisonQuerySnapshot.forEach((livraisonDoc) => {
              const data = livraisonDoc.data();

              if (data.images && data.images.length > 0) {
                // Ajouter l'identifiant unique de la livraison à l'ensemble
                uniqueLivraisons.add(livraisonDoc.id);

                // Ajouter la livraison au tableau nouvellesLivraisons
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
                  descriptLivraison: data.description,
                  UserID: data.userID,
                });
              }
            });
          }

          // Transformer l'ensemble en un tableau pour permettre la mise à jour de l'état local
          const livraisonsArray = Array.from(uniqueLivraisons);

          // Récupérer les données des livraisons de manière asynchrone
          const livraisonsDataPromises = livraisonsArray.map(
            async (livraisonId) => {
              const livraisonDocRef = doc(db, 'publication', livraisonId);
              const livraisonDocSnapshot = await getDoc(livraisonDocRef);

              if (livraisonDocSnapshot.exists()) {
                const data = livraisonDocSnapshot.data();
                return {
                  key: livraisonId,
                  date: format(
                    new Date(data.date.seconds * 1000),
                    'dd/MM/yyyy - HH:mm:ss'
                  ),
                  apprenant: data.nom,
                  titreCourEtudiant: data.cours,
                  images: data.images || [],
                  userProfile: data.profile,
                  descriptLivraison: data.description,
                  UserID: data.userID,
                };
              } else {
                return null;
              }
            }
          );

          // Attendre que toutes les données des livraisons soient récupérées
          const livraisonsData = await Promise.all(livraisonsDataPromises);

          // Filtrer les éléments nuls (livraisons non trouvées) et trier par date décroissante
          const livraisonsFiltered = livraisonsData.filter(
            (liv) => liv !== null
          );
          livraisonsFiltered.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          // Mettre à jour l'état local avec les nouvelles livraisons
          setLivraisons(livraisonsFiltered);
        } else {
          console.log('Aucun document publication trouvé.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des livraisons', error);
      }
    };

    fetchLivraisons();
  }, []);

  const loadUsers = useCallback(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
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
    <div className="d-flex flex-column flex-wrap ms-0 ms-lg-3 justify-content-center">
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Dashboard
      </h1>
      <div className="d-flex ContaCardDsb justify-content-start">
        {ContenuCardDsb.map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      <div className="d-flex flex-column justify-content-center">
        {livraisons.map((livraison) => (
          <CardLivraison
            key={livraison.key}
            livraison={livraison}
            {...livraison}
            handleDeleteLivraison={handleDeleteLivraison}
            handleUpdateDescription={handleUpdateDescription}
          />
        ))}
      </div>
    </div>
  );
}
