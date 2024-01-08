// // Importation des modules nécessaires depuis les bibliothèques
// import { MultiCascader } from "rsuite";
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   where,
//   query,
//   arrayUnion,
// } from "firebase/firestore";
// import { db } from "../../config/firebase-config";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "rsuite/dist/rsuite.css";
// import { PulseLoader } from "react-spinners";
// import React from "react";
// import SpinnerIcon from "@rsuite/icons/legacy/Spinner";

// // Les en-têtes pour les catégories dans le MultiCascader
// const headers = ["Coachs", "Etudiants"];

//  const AssignationPage = () => {
//   // États pour stocker les données nécessaires dans le composant
//   const [coachs, setCoachs] = useState([]);
//   const [etudiants, setEtudiants] = useState([]);
//   const [value, setValue] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(false);

//   // Fonction de tri personnalisée pour les options du MultiCascader
//   const customSortFunction = (a, b) => {
//     const windowA = a.split(".")[0];
//     const windowB = b.split(".")[0];

//     if (windowA < windowB) return -1;
//     if (windowA > windowB) return 1;

//     return a.localeCompare(b);
//   };

//   // Gestionnaire de changement pour le MultiCascader
//   const handleChange = (newValue) => {
//     const selectedCoaches = newValue.filter((val) =>
//       coachs.find((coach) => coach.email === val)
//     );

//     if (selectedCoaches.length > 1) {
//       setErrorMessage(
//         "Vous ne pouvez sélectionner qu'un seul coach à la fois."
//       );
//       return;
//     }

//     if (selectedCoaches.length === 0) {
//       setValue([]);
//       setSelectedStudents([]);
//       setErrorMessage(
//         "Veuillez d'abord sélectionner un Coach avant de sélectionner un Etudiant !"
//       );
//       return;
//     }

//     setValue(newValue);
//     setSelectedStudents(newValue.slice(selectedCoaches.length));
//     setErrorMessage(null);
//   };

//   // Gestionnaire d'assignation
//   const handleAssign = async (e) => {
//     e.preventDefault();

//     if (selectedStudents.length > 0) {
//       setLoading(true);

//       try {
//         const selectedCoaches = value.filter((val) =>
//           coachs.find((coach) => coach.email === val)
//         );

//         for (const selectedCoach of selectedCoaches) {
//           // Récupération des informations du coach sélectionné
//           const coachQuery = query(
//             collection(db, "utilisateurs"),
//             where("email", "==", selectedCoach)
//           );
//           const coachDocs = await getDocs(coachQuery);

//           if (coachDocs.size > 0) {
//             const coachDoc = coachDocs.docs[0];
//             const sousDomaineDuCoach = coachDoc.data().sousDomaines;

//             const etudiantsSelectionnes = [];

//             for (const selectedEtudiant of selectedStudents) {
//               // Récupération des informations de l'étudiant sélectionné
//               const etudiantQuery = query(
//                 collection(db, "utilisateurs"),
//                 where("email", "==", selectedEtudiant)
//               );
//               const etudiantDocs = await getDocs(etudiantQuery);

//               if (etudiantDocs.size > 0) {
//                 const etudiantDoc = etudiantDocs.docs[0];

//                 // Mise à jour des informations de l'étudiant
//                 await updateDoc(etudiantDoc.ref, {
//                   coach: coachDoc.data().name,
//                   sousDomaines: sousDomaineDuCoach,
//                 });

//                 etudiantsSelectionnes.push(etudiantDoc.data().name);
//               } else {
//                 console.warn(
//                   `Aucun document d'étudiant trouvé avec l'email spécifié: ${selectedEtudiant}`
//                 );
//               }
//             }

//             // Mise à jour des informations du coach avec la liste des étudiants assignés
//             await updateDoc(coachDoc.ref, {
//               etudiants: arrayUnion(...etudiantsSelectionnes),
//             });

//             setErrorMessage(null);
//             toast.success("Assignation d'etudiant(s) au coach réussie !");
//           } else {
//             setErrorMessage(
//               "Aucun document de coach trouvé avec l'email spécifié."
//             );
//           }
//         }
//       } catch (error) {
//         console.error("Erreur lors de l'assignation :", error);
//         setErrorMessage("Erreur lors de l'assignation. Veuillez réessayer.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setErrorMessage(
//         "Veuillez sélectionner au moins un étudiant pour pouvoir effectuer l'assignation."
//       );
//     }

//     setValue([]);
//     setSelectedStudents([]);
//   };

//   // Fonction pour personnaliser le rendu du menu du MultiCascader
//   const renderMenu = (children, menu, parentNode, layer) => {
//     return (
//       <div>
//         <div
//           style={{
//             background: "#3084b5",
//             padding: "4px 10px",
//             color: " #fff",
//             paddingLeft: "38px",
//             fontWeight: "bold",
//           }}
//         >
//           {headers[layer]}
//         </div>
//         {dataLoading ? (
//           <p
//             style={{
//               padding: 4,
//               color: "#3084b5",
//               textAlign: "center",
//               fontSize: "28px",
//             }}
//           >
//             <SpinnerIcon spin />
//           </p>
//         ) : (
//           menu
//         )}
//       </div>
//     );
//   };

//   // Effet secondaire pour charger les données nécessaires lors du montage du composant
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setDataLoading(true);

//         // Récupération des coachs depuis la base de données
//         const coachsQuery = query(
//           collection(db, "utilisateurs"),
//           where("role", "==", "Coach")
//         );
//         const coachsDocs = await getDocs(coachsQuery);
//         const coachsData = coachsDocs.docs.map((doc) => doc.data());
//         setCoachs(coachsData);

//         // Récupération des étudiants sans coach depuis la base de données
//         const etudiantsQuery = query(
//           collection(db, "utilisateurs"),
//           where("role", "==", "Étudiant")
//         );
//         const etudiantsDocs = await getDocs(etudiantsQuery);
//         const etudiantsData = etudiantsDocs.docs
//           .map((doc) => doc.data())
//           .filter((etudiant) => !etudiant.coach);
//         setEtudiants(etudiantsData);
//       } catch (error) {
//         console.error("Erreur lors du chargement des données :", error);
//         setErrorMessage(
//           "Erreur lors du chargement des données. Veuillez réessayer."
//         );
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     // Vérification de l'initialisation de la base de données Firebase
//     if (db) {
//       loadData();
//     } else {
//       console.error(
//         "Erreur: La base de données Firebase n'est pas initialisée."
//       );
//       setErrorMessage(
//         "Erreur: La base de données Firebase n'est pas initialisée."
//       );
//     }
//   }, [db]);

//   // Rendu du composant Assignation
//   return (
//     <div
//       className="p-2 d-flex justify-content-center flex-wrap"
//       style={{ width: "100%" }}
//     >
//       <div className="ComtaTabAss m-auto" style={{ padding: "20px" }}>
//         <div className="mt-5" style={{ marginBottom: "250px" }}>
//           {/* Composant MultiCascader pour la sélection des coachs et des étudiants */}
//           <MultiCascader
//             style={{ width: "100%" }}
//             data={coachs.map((coach) => ({
//               label: coach.name,
//               value: coach.email,
//               children: etudiants.map((etudiant) => ({
//                 label: etudiant.name,
//                 value: etudiant.email,
//               })),
//             }))}
//             cascade={false}
//             onChange={handleChange}
//             value={value}
//             appearance="default"
//             menuWidth={200}
//             menuHeight={"auto"}
//             placeholder="Assigner un ou des étudiant(s) à un coach"
//             size="lg"
//             classPrefix="picker"
//             renderMenu={renderMenu}
//           />
//           {errorMessage && <small className="SmallMsg">{errorMessage}</small>}
//         </div>
//         {/* Bouton d'assignation avec gestion de chargement */}
//         <div className="mt-5 d-flex align-items-center w-100">
//           <button
//             className="btn w-100 text-white boutonAssign rounded-5 fw-bold"
//             style={{ backgroundColor: " #3084b5" }}
//             onClick={handleAssign}
//             disabled={loading}
//           >
//             {loading ? "Assignation" : "Assigner"}
//           </button>
//           {loading && (
//             <PulseLoader className="ms-1" color={"#0057a0"} size={12} />
//           )}
//         </div>
//         {/* Conteneur pour les notifications Toast */}
//         <ToastContainer />
//       </div>
//     </div>
//   );
// };


// export default AssignationPage;