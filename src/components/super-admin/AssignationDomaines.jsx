import { MultiCascader } from 'rsuite';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  where,
  query,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'rsuite/dist/rsuite.css';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { AssignationEtudiant } from './AssignationEtudiant';

const AssignationPage = () => {
  const [domaines, setDomaines] = useState([]);
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (e) => {
    e.preventDefault();

    if (value.length > 0) {
      setLoading(true); // Activer le chargement

      const selectedCoach = value[value.length - 1];
      const [domaine, sousDomaines, userEmail] = selectedCoach.split('-');

      // Vérification du sous-domaine
      if (!sousDomaines) {
        setErrorMessage(
          'Veuillez choisir un domaine / sous-domaine et un coach pour pouvoir assigner.'
        );
        setLoading(false); // Désactiver le chargement en cas d'erreur
        return;
      }

      // Vérification du coach
      if (!userEmail) {
        setErrorMessage('Veuillez choisir un coach pour pouvoir assigner.');
        setLoading(false); // Désactiver le chargement en cas d'erreur
        return;
      }

      try {
        const coachQuery = query(
          collection(db, 'utilisateurs'),
          where('email', '==', userEmail)
        );
        const coachDocs = await getDocs(coachQuery);

        if (coachDocs.size > 0) {
          const coachDoc = coachDocs.docs[0];
          const coachDocRef = doc(db, 'utilisateurs', coachDoc.id);
          await updateDoc(coachDocRef, {
            domaine: domaine,
            sousDomaines,
          });

          setErrorMessage(null);
          toast.success(
            'Assignation de domaine / sous-domaine au coach réussie !'
          );
        } else {
          setErrorMessage(
            "Aucun document de coach trouvé avec l'e-mail spécifié."
          );
        }
      } catch (error) {
        console.error("Erreur lors de l'assignation :", error);
        setErrorMessage("Erreur lors de l'assignation. Veuillez réessayer.");
      } finally {
        setLoading(false); // Désactiver le chargement une fois la requête terminée
      }
    } else {
      setErrorMessage(
        'Aucun coach sélectionné. Veuillez sélectionner un coach.'
      );
    }

    setValue([]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const domaineCollection = collection(db, 'domaines');
        const domainesSnapshot = await getDocs(domaineCollection);
        const domainesData = domainesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDomaines(domainesData);

        const collectionUtilisateurs = collection(db, 'utilisateurs');
        const utilisateursSnapshot = await getDocs(collectionUtilisateurs);
        const utilisateursData = utilisateursSnapshot.docs.map((doc) =>
          doc.data()
        );
        setUsers(utilisateursData);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
        setErrorMessage(
          'Erreur lors du chargement des données. Veuillez réessayer.'
        );
      }
    };

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
  }, [db]);

  const options = domaines.map((domaine) => ({
    label: domaine.domaine,
    value: domaine.domaine,
    children: Object.keys(domaine.sousDomaines).map((sousDomaineKey) => {
      const sousDomaines = domaine.sousDomaines[sousDomaineKey];
      const coachsForSousDomaine = users.filter(
        (coach) => coach.role === 'Coach'
      );

      return {
        label: sousDomaineKey,
        value: sousDomaineKey,
        children: coachsForSousDomaine.map((coach) => ({
          label: coach.name,
          value: `${domaine.domaine}-${sousDomaineKey}-${coach.email}-${coach.name}-${coach.password}`,
        })),
      };
    }),
  }));

  return (
    <div
      className=" d-flex justify-content-center flex-column"
      style={{ width: '100%' }}
    >
      <div className=" w-100 text-center">
        <p className="fs-3 mb-2 fst-italic fw-bold text-dark">
          Tableau D'assignation de Domaines de L'administrateur{' '}
        </p>
        <p className="fs-5 fst-italic fw-medium text-secondary w-75 m-auto">
          Sélectionnez un Domaine, un Sous-Domaine et un Coach pour lui assigner
          un Domaine et un Sous-Domaine
        </p>
      </div>

      <div className="ComtaTabAss m-auto" style={{ padding: '20px' }}>
        <div className="mt-5" style={{ marginBottom: '250px' }}>
          <MultiCascader
            style={{ width: '100%' }}
            data={options}
            cascade={false}
            onChange={setValue}
            value={value}
            appearance="default"
            menuWidth={'200px'}
            menuHeight={'auto'}
            placeholder="Assigner un domaine à un coach"
            size="lg"
            classPrefix="picker"
          />
          {errorMessage && <small className="SmallMsg">{errorMessage}</small>}
        </div>
        <div className="mt-5 d-flex align-items-center w-100 wmd">
          <button
            className="btn w-100 text-white fw-bold boutonAssign py-2"
            style={{ backgroundColor: ' #3084b5' }}
            onClick={handleAssign}
            disabled={loading} // Désactiver le clic si le chargement est actif
          >
            {loading ? 'Assignation' : 'Assigner'}
          </button>
          {loading && (
            <PulseLoader className="ms-1" color={'#0057d0'} size={12} />
          )}
        </div>
        <ToastContainer /> {/* Container pour les toasts */}
      </div>

      <div className="AdmLineDif"></div>

      <div className=" w-100 text-center">
        <p className="fs-3 mb-2 fst-italic fw-bold text-dark">
          Tableau D'assignation d'étudiant(s) de L'administrateur{' '}
        </p>
        <p className="fs-5 fst-italic fw-medium text-secondary w-75 m-auto">
          Sélectionnez un Coach et un ou plusieurs Etudiant(s) pour le(s)
          assigner au Coach Selectionné .
        </p>
      </div>

      <AssignationEtudiant />
    </div>
  );
};

export default AssignationPage;
