import React from 'react'
import { MultiCascader } from "rsuite";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  where,
  query,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.css";
import { PulseLoader } from "react-spinners";

export const AssignationEtudiant = () => {
 const [coachs, setCoachs] = useState([]);
 const [etudiants, setEtudiants] = useState([]);
 const [value, setValue] = useState([]);
 const [selectedStudents, setSelectedStudents] = useState([]);
 const [errorMessage, setErrorMessage] = useState(null);
 const [loading, setLoading] = useState(false);

 const handleAssign = async (e) => {
   e.preventDefault();

   if (selectedStudents.length > 0) {
     setLoading(true);

     try {
       const selectedCoach = value[0];

       // Récupérer le document du coach par son email
       const coachQuery = query(
         collection(db, "utilisateurs"),
         where("email", "==", selectedCoach)
       );
       const coachDocs = await getDocs(coachQuery);

       if (coachDocs.size > 0) {
         const coachDoc = coachDocs.docs[0];
         const sousDomaineDuCoach = coachDoc.data().sousDomaines;

         // Récupérer les noms des étudiants sélectionnés
         const etudiantsSelectionnes = [];

         for (const selectedEtudiant of selectedStudents) {
           const etudiantQuery = query(
             collection(db, "utilisateurs"),
             where("email", "==", selectedEtudiant)
           );
           const etudiantDocs = await getDocs(etudiantQuery);

           if (etudiantDocs.size > 0) {
             const etudiantDoc = etudiantDocs.docs[0];

             // Mettre à jour le document de l'étudiant avec le nom du coach
             await updateDoc(etudiantDoc.ref, {
               coach: coachDoc.data().name,
               sousDomaines: sousDomaineDuCoach, // Ajout du champ sousDomaine
             });

             etudiantsSelectionnes.push(etudiantDoc.data().name);
           } else {
             console.warn(
               `Aucun document d'étudiant trouvé avec l'email spécifié: ${selectedEtudiant}`
             );
           }
         }

         // Mettre à jour le document du coach avec la liste des noms des étudiants
         await updateDoc(coachDoc.ref, {
           etudiants: arrayUnion(...etudiantsSelectionnes),
         });

         setErrorMessage(null);
         toast.success("Assignation d'etudiant(s) au coach réussie !");
       } else {
         setErrorMessage(
           "Aucun document de coach trouvé avec l'email spécifié."
         );
       }
     } catch (error) {
       console.error("Erreur lors de l'assignation :", error);
       setErrorMessage("Veuillez d'abord sélectionner un coach.");
     } finally {
       setLoading(false);
     }
   } else {
     setErrorMessage(
       "Veuillez sélectionner au moins un étudiant pour pouvoir effectuer l'assignation."
     );
   }

   setValue([]);
   setSelectedStudents([]);
 };

 useEffect(() => {
   const loadData = async () => {
     try {
       const coachsQuery = query(
         collection(db, "utilisateurs"),
         where("role", "==", "Coach")
       );
       const coachsDocs = await getDocs(coachsQuery);
       const coachsData = coachsDocs.docs.map((doc) => doc.data());
       setCoachs(coachsData);

       const etudiantsQuery = query(
         collection(db, "utilisateurs"),
         where("role", "==", "Étudiant")
       );
       const etudiantsDocs = await getDocs(etudiantsQuery);
       const etudiantsData = etudiantsDocs.docs
         .map((doc) => doc.data())
         .filter((etudiant) => !etudiant.coach);
       setEtudiants(etudiantsData);
     } catch (error) {
       console.error("Erreur lors du chargement des données :", error);
       setErrorMessage(
         "Erreur lors du chargement des données. Veuillez réessayer."
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

 const customSortFunction = (a, b) => {
   const windowA = a.split(".")[0];
   const windowB = b.split(".")[0];

   if (windowA < windowB) return -1;
   if (windowA > windowB) return 1;

   return a.localeCompare(b);
 };

 return (
   <div
     className="p-2 d-flex justify-content-center"
     style={{ width: "100%"}}
   >

     <div className="ComtaTabAss m-auto" style={{ padding: "20px" }}>
       <div className="mt-5" style={{ marginBottom: "250px" }}>
         <MultiCascader
           style={{ width: "100%" }}
           data={coachs.map((coach) => ({
             label: coach.name,
             value: coach.email,
             children: etudiants.map((etudiant) => ({
               label: etudiant.name,
               value: etudiant.email,
             })),
           }))}
           cascade={false}
           onChange={(newValue) => {
             const selectedCoach = newValue[0];

             // Vérifier si un coach est sélectionné
             if (!selectedCoach) {
               // Aucun coach sélectionné, réinitialiser la valeur
               setValue([]);
               setSelectedStudents([]);
               setErrorMessage("Veuillez d'abord sélectionner un coach.");
               return;
             }

             const uniqueNames = Array.from(new Set(newValue.slice(1)));
             const sortedValue = [newValue[0], ...uniqueNames].sort(
               customSortFunction
             );

             // Filtrer le value pour mettre le coach en première position
             const filteredValue = sortedValue.filter(
               (val) => val === newValue[0]
             );

             // Ajouter les étudiants à la fin
             filteredValue.push(
               ...sortedValue.filter((val) => val !== newValue[0])
             );

             setValue(filteredValue);
             setSelectedStudents(uniqueNames);
             setErrorMessage(null);
           }}
           value={value}
           appearance="default"
           menuWidth={200}
           menuHeight={"auto"}
           placeholder="Assigner un ou des étudiant(s) à un coach"
           size="lg"
           classPrefix="picker"
         />
         {errorMessage && <small className="SmallMsg">{errorMessage}</small>}
       </div>
       <div className="mt-5 d-flex align-items-center w-100">
         <button
           className="btn w-100 text-white boutonAssign"
           style={{ backgroundColor: " #0056b3" }}
           onClick={handleAssign}
           disabled={loading}
         >
           {loading ? "Assignation" : "Assigner"}
         </button>
         {loading && (
           <PulseLoader className="ms-1" color={"#0057d0"} size={12} />
         )}
       </div>
       <ToastContainer />
     </div>
   </div>
 );
}
