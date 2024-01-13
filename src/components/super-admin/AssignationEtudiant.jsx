// Importation des bibliothèques et composants nécessaires depuis les modules externes et les fichiers locaux
import { useForm } from 'react-hook-form';
import { MultiSelect } from 'primereact/multiselect';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  where,
  query,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import 'react-toastify/dist/ReactToastify.css';
import 'rsuite/dist/rsuite.css';
import { PulseLoader } from 'react-spinners';
import React from 'react';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import FirebaseTable from './EtudiantsAssignTable';
import EtudiantsAssignTable from './EtudiantsAssignTable';

export const AssignationEtudiant = () => {
  // Initialisation des états pour stocker les données et le statut de chargement
  const [coachs, setCoachs] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [selectedCoaches, setSelectedCoaches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
   // eslint-disable-next-line
  const [dataLoading, setDataLoading] = useState(false);
  const [notificationsCollection] = useState(
    collection(db, "notifications")
  );

  // Utilisation de useRef pour la gestion des toasts
   // eslint-disable-next-line
  const toastRef = useRef(null);

  // Fonction pour afficher un toast de succès
  const showSuccessToast = (detail) => {
    toast.success(`Assignation réussie : ${detail}`);
  };

  // Utilisation du hook useForm pour gérer le formulaire
   // eslint-disable-next-line
  const {
     // eslint-disable-next-line
    control,
     // eslint-disable-next-line
    formState: { errors },
     // eslint-disable-next-line
    handleSubmit,
     // eslint-disable-next-line
    getValues,
    reset,
  } = useForm();

  // Fonction appelée lors de la soumission du formulaire
   // eslint-disable-next-line
  const onSubmit = (data) => {
    handleAssign();
  };

  // Gestion du changement de sélection des coaches
  const handleChangeCoaches = (e) => {
    // Limiter la sélection à un seul coach
    setSelectedCoaches(e.value.slice(-1));
    setErrorMessage(null);
  };

  // Gestion du changement de sélection des étudiants
  const handleChangeStudents = (e) => {
    // Vérifier si un coach est sélectionné
    if (selectedCoaches.length === 0) {
      setErrorMessage("Veuillez d'abord sélectionner un coach.");
      return;
    }

    setSelectedStudents(e.value);
    setErrorMessage(null);
  };

  // Fonction pour effectuer l'assignation
  const handleAssign = async () => {
    // Vérifier si au moins un coach et un étudiant sont sélectionnés
    if (selectedCoaches.length === 0 || selectedStudents.length === 0) {
      setErrorMessage(
        'Veuillez sélectionner au moins un coach et un étudiant.'
      );
      return;
    }

    // Activer l'état de chargement
    setLoading(true);

    try {
      // Effectuer l'assignation pour chaque coach sélectionné
      await Promise.all(
        selectedCoaches.map(async (selectedCoachEmail) => {
          // Requête pour obtenir le document du coach
          const coachQuery = query(
            collection(db, 'utilisateurs'),
            where('email', '==', selectedCoachEmail)
          );
          const coachDocs = await getDocs(coachQuery);

          // Vérifier si le document du coach existe
          if (coachDocs.size > 0) {
            const coachDoc = coachDocs.docs[0];
            const sousDomaineDuCoach = coachDoc.data().sousDomaines;

            // Assigner chaque étudiant sélectionné au coach
            const etudiantsSelectionnes = await Promise.all(
              selectedStudents.map(async (selectedEtudiant) => {
                const etudiantQuery = query(
                  collection(db, 'utilisateurs'),
                  where('email', '==', selectedEtudiant)
                );
                const etudiantDocs = await getDocs(etudiantQuery);

                // Vérifier si le document de l'étudiant existe
                if (etudiantDocs.size > 0) {
                  const etudiantDoc = etudiantDocs.docs[0];

                  // Mettre à jour le document de l'étudiant avec les informations du coach
                  await updateDoc(etudiantDoc.ref, {
                    coach: coachDoc.data().name,
                    sousDomaines: sousDomaineDuCoach,
                    emailCoach: coachDoc.data().email,
                  });

                  return etudiantDoc.data().name;
                } else {
                  console.warn(
                    `Aucun document d'étudiant trouvé avec l'email spécifié: ${selectedEtudiant}`
                  );
                  return null;
                }
              })
            );

            // Mettre à jour le document du coach avec la liste des étudiants assignés
            await updateDoc(coachDoc.ref, {
              etudiants: arrayUnion(...etudiantsSelectionnes.filter(Boolean)),
            });

            let notificationMessage;
            if(etudiantsSelectionnes.length > 1){
              notificationMessage = `Les étudiants ${etudiantsSelectionnes} vous ont étés assignés`
            }else{
              notificationMessage = `L'étudiant ${etudiantsSelectionnes} vous a été assigné`
            }
            await addDoc(notificationsCollection, {
              messageForAdmin: notificationMessage,
              timestamp: serverTimestamp(),
              newNotif: true,
              email: selectedCoachEmail,
            });

            // Afficher le toast de succès
            showSuccessToast(`Assignation à ${coachDoc.data().name}`);
          } else {
            setErrorMessage(
              "Aucun document de coach trouvé avec l'email spécifié."
            );
          }
        })
      );

      // Vider les champs après l'assignation réussie
      setSelectedCoaches([]);
      setSelectedStudents([]);

      setErrorMessage(null);
    } catch (error) {
      console.error("Erreur lors de l'assignation :", error);
      setErrorMessage("Erreur lors de l'assignation. Veuillez réessayer.");
    } finally {
      // Désactiver l'état de chargement et réinitialiser le formulaire
      setLoading(false);
      reset();
    }
  };

  // Utilisation du hook useEffect pour charger les données au rendu initial
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);

        // Requête pour obtenir la liste des coachs
        const coachsQuery = query(
          collection(db, 'utilisateurs'),
          where('role', '==', 'Coach')
        );
        const coachsDocs = await getDocs(coachsQuery);
        const coachsData = coachsDocs.docs.map((doc) => doc.data());
        setCoachs(coachsData);

        // Requête pour obtenir la liste des étudiants sans coach
        const etudiantsQuery = query(
          collection(db, 'utilisateurs'),
          where('role', '==', 'Étudiant')
        );
        const etudiantsDocs = await getDocs(etudiantsQuery);
        const etudiantsData = etudiantsDocs.docs
          .map((doc) => doc.data())
          .filter((etudiant) => !etudiant.coach);
        setEtudiants(etudiantsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
        setErrorMessage(
          'Erreur lors du chargement des données. Veuillez réessayer.'
        );
      } finally {
        setDataLoading(false);
      }
    };

    // Charger les données seulement si la base de données est initialisée
    if (db) {
      loadData();
    } else {
      console.error(
        "Erreur: La base de données Firebase n'est pas initialisée."
      );
      setErrorMessage(
        "Erreur: La base de données Firebase n'est pas initialisée."
      );
    }
     // eslint-disable-next-line
  }, [db]);

  // Rendu de la composante
  return (
    <div
      className="p-3 d-flex justify-content-center flex-column"
      style={{ width: '100%' }}
    >
      <div className="ComtaTabAss m-auto" style={{ padding: '20px' }}>
        <div className="mt-5" style={{ marginBottom: '220px' }}>
          <div className="d-flex flex-column">
            {/* Sélection du coach */}
            <div className="mb-3">
              <label htmlFor="coachesSelect" className="form-label">
                Sélectionner un coach
              </label>
              <MultiSelect
                style={{ width: '100%' }}
                value={selectedCoaches}
                options={coachs.map((coach) => ({
                  label: coach.name,
                  value: coach.email,
                }))}
                onChange={handleChangeCoaches}
                placeholder="Sélectionner un coach"
                className="w-full"
                id="coachesSelect"
              />
            </div>

            {/* Sélection des étudiants */}
            <div>
              <label htmlFor="studentsSelect" className="form-label">
                Sélectionner un ou des étudiants
              </label>
              <MultiSelect
                style={{ width: '100%' }}  
                value={selectedStudents}
                options={etudiants.map((etudiant) => ({
                  label: etudiant.name,
                  value: etudiant.email,
                }))}
                onChange={handleChangeStudents}
                placeholder="Sélectionner un ou des étudiants"
                className="w-full"
                scrollHeight="160px"
                disabled={selectedCoaches.length !== 1}
                id="studentsSelect"
              />
            </div>
          </div>

          {/* Affichage du message d'erreur s'il y a lieu */}
          {errorMessage && <small className="SmallMsg">{errorMessage}</small>}
        </div>

        {/* Bouton d'assignation avec indication de chargement */}
        <div className="mt-5 d-flex align-items-center w-100">
          <button
            className="btn w-100 text-white boutonAssign rounded-5 fw-bold"
            style={{ backgroundColor: ' #3084b5' }}
            onClick={handleAssign}
            disabled={
              loading ||
              selectedCoaches.length === 0 ||
              selectedStudents.length === 0
            }
          >
            {loading ? 'Assignation' : 'Assigner'}
          </button>

          {/* Indicateur de chargement en cours */}
          {loading && (
            <PulseLoader className="ms-1" color={'#0057a0'} size={12} />
          )}
        </div>

        {/* Conteneur pour les toasts de notification */}
        <ToastContainer />
      </div>
      <EtudiantsAssignTable />
    </div>
  );
};
