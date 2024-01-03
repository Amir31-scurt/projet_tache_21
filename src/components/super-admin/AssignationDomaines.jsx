// Importation des composants et bibliothèques nécessaires
import { MultiCascader } from "rsuite";
import { useEffect, useState } from "react"; 
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  where,
  query,
} from "firebase/firestore"; 
import { db } from "../../config/firebase-config"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.css"; 
import { PulseLoader } from "react-spinners"; 
import { AssignationEtudiant } from "./AssignationEtudiant"; 
import SpinnerIcon from "@rsuite/icons/legacy/Spinner"; 

// Définition des entêtes pour le tableau d'assignation
const headers = ["Domaines", "Sous-Domaines", "Coachs"];

// Définition du composant AssignationPage
const AssignationPage = () => {
  // Déclaration des états
  const [domaines, setDomaines] = useState([]);
  const [users, setUsers] = useState([]); 
  const [value, setValue] = useState([]); // Valeur sélectionnée dans le MultiCascader
  const [errorMessage, setErrorMessage] = useState(null); // Message d'erreur
  const [loading, setLoading] = useState(false); 
  const [dataLoading, setDataLoading] = useState(false);

  // Fonction de gestion de l'assignation
  const handleAssign = async (e) => {
    e.preventDefault();

    // Vérification de la sélection d'un coach
    if (value.length > 0) {
      setLoading(true); 

      // Extraction des informations du coach sélectionné
      const selectedCoach = value[value.length - 1];
      const [domaine, sousDomaines, userEmail] = selectedCoach.split("-");

      // Vérification du sous-domaine et du coach
      if (!sousDomaines) {
        setErrorMessage(
          "Veuillez choisir un domaine / sous-domaine et un coach pour pouvoir assigner."
        );
        setLoading(false);
        return;
      }

      if (!userEmail) {
        setErrorMessage("Veuillez choisir un coach pour pouvoir assigner.");
        setLoading(false); 
        return;
      }

      try {
        // Requête pour obtenir le document du coach
        const coachQuery = query(
          collection(db, "utilisateurs"),
          where("email", "==", userEmail)
        );
        const coachDocs = await getDocs(coachQuery);

        // Mise à jour du document du coach avec le domaine et sous-domaine
        if (coachDocs.size > 0) {
          const coachDoc = coachDocs.docs[0];
          const coachDocRef = doc(db, "utilisateurs", coachDoc.id);
          await updateDoc(coachDocRef, {
            domaine: domaine,
            sousDomaines,
          });

          setErrorMessage(null);
          toast.success(
            "Assignation de domaine / sous-domaine au coach réussie !"
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
        setLoading(false); // Désactivation du chargement une fois la requête terminée
      }
    } else {
      setErrorMessage(
        "Aucun coach sélectionné. Veuillez sélectionner un coach."
      );
    }

    setValue([]);
  };

  // Effet de chargement des données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        // Chargement des domaines
        const domaineCollection = collection(db, "domaines");
        const domainesSnapshot = await getDocs(domaineCollection);
        const domainesData = domainesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDomaines(domainesData);

        // Chargement des utilisateurs
        const collectionUtilisateurs = collection(db, "utilisateurs");
        const utilisateursSnapshot = await getDocs(collectionUtilisateurs);
        const utilisateursData = utilisateursSnapshot.docs.map((doc) =>
          doc.data()
        );
        setUsers(utilisateursData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setErrorMessage(
          "Erreur lors du chargement des données. Veuillez réessayer."
        );
      } finally {
        setDataLoading(false);
      }
    };

    // Vérification de l'initialisation de la base de données Firebase
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

  // Création des options pour le composant MultiCascader
  const options = domaines.map((domaine) => ({
    label: domaine.domaine,
    value: domaine.domaine,
    children: Object.keys(domaine.sousDomaines).map((sousDomaineKey) => {
      const sousDomaines = domaine.sousDomaines[sousDomaineKey];
      const coachsForSousDomaine = users.filter(
        (coach) => coach.role === "Coach"
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

  // Rendu du composant AssignationPage
  return (
    <div
      className="d-flex justify-content-center flex-column"
      style={{ width: "100%" }}
    >
      {/* En-tête et description de la page */}
      <div className="AdmLineDif"></div>
      <div className="w-100 text-center">
        <p className="fs-3 mb-2 fst-italic fw-bold text-dark">
          Tableau D'assignation de Domaines de L'administrateur{" "}
        </p>
        <p className="fs-5 fst-italic fw-medium text-secondary w-75 m-auto">
          Sélectionnez un Domaine, un Sous-Domaine et un Coach pour lui assigner
          un Domaine et un Sous-Domaine
        </p>
      </div>

      {/* Tableau d'assignation avec le composant MultiCascader */}
      <div className="ComtaTabAss m-auto" style={{ padding: "20px" }}>
        <div className="mt-5" style={{ marginBottom: "250px" }}>
          {/* Composant MultiCascader pour la sélection en cascade */}
          <MultiCascader
            style={{ width: "100%" }}
            data={options}
            cascade={false}
            onChange={setValue}
            value={value}
            appearance="default"
            menuWidth={{ width: "100%" }}
            menuHeight={"auto"}
            placeholder="Assigner un domaine à un coach"
            size="lg"
            classPrefix="picker"
            renderMenu={(children, menu, parentNode, layer) => {
              return (
                <div>
                  <div
                    style={{
                      background: "#3084b5",
                      padding: "4px 10px",
                      color: " #fff",
                      paddingLeft: "38px",
                      fontWeight: "bold",
                    }}
                  >
                    {headers[layer]}
                  </div>
                  {dataLoading ? (
                    <p
                      style={{
                        padding: 4,
                        color: "#3084b5",
                        textAlign: "center",
                        fontSize: "28px",
                      }}
                    >
                      {/* Icône de chargement en cours */}
                      <SpinnerIcon spin />
                    </p>
                  ) : (
                    menu
                  )}
                </div>
              );
            }}
          />
          {/* Affichage du message d'erreur s'il y en a un */}
          {errorMessage && <small className="SmallMsg">{errorMessage}</small>}
        </div>
        {/* Bouton d'assignation avec indicateur de chargement */}
        <div className="mt-5 d-flex align-items-center w-100 wmd">
          <button
            className="btn w-100 text-white fw-bold boutonAssign py-2"
            style={{ backgroundColor: " #3084b5" }}
            onClick={handleAssign}
            disabled={loading} // Désactiver le clic si le chargement est actif
          >
            {loading ? "Assignation" : "Assigner"}
          </button>
          {/* Affichage de l'indicateur de chargement */}
          {loading && (
            <PulseLoader className="ms-1" color={"#0057d0"} size={12} />
          )}
        </div>
        {/* Container pour les notifications (toasts) */}
        <ToastContainer />
      </div>

      {/* Ligne de séparation */}
      <div className="AdmLineDif"></div>

      {/* En-tête et description de la page d'assignation d'étudiants */}
      <div className="w-100 text-center">
        <p className="fs-3 mb-2 fst-italic fw-bold text-dark">
          Tableau D'assignation d'étudiant(s) de L'administrateur{" "}
        </p>
        <p className="fs-5 fst-italic fw-medium text-secondary w-75 m-auto">
          Sélectionnez un Coach et un ou plusieurs Etudiant(s) pour le(s)
          assigner au Coach sélectionné.
        </p>
      </div>

      {/* Composant pour l'assignation d'étudiants */}
      <AssignationEtudiant />
    </div>
  );
};

// Exportation du composant AssignationPage
export default AssignationPage;
