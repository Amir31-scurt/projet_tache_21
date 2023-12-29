import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { TreeTable } from "primereact/treetable";
// import { NodeService } from "./service/NodeService";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { classNames } from "primereact/utils";

//========= Imports Assignation debut =========/

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { MultiCascader } from "rsuite";
import "rsuite/dist/rsuite.css";
import { db } from "../../config/firebase-config";

//========= Imports Assignation  Fin=========/

export default function TemplateDemo() {
  const [domaines, setDomaines] = useState([]);
  const [users, setUsers] = useState([]);
  const [cascade, setCascade] = useState(false);
  const [value, setValue] = useState([]);

  const handleAssign = async (e) => {
    e.preventDefault();

    if (value.length > 0) {
      // Obtenez le dernier élément sélectionné (le coach)
      const selectedCoach = value[value.length - 1];
      const [domaine, sousDomaine, userEmail] = selectedCoach.split("-");

      try {
        // Requête pour récupérer le document du coach par e-mail
        const coachQuery = query(
          collection(db, "utilisateurs"),
          where("email", "==", userEmail)
        );
        const coachDocs = await getDocs(coachQuery);

        if (coachDocs.size > 0) {
          // Utilisez le premier document trouvé (vous pouvez ajuster cela en fonction de vos besoins)
          const coachDoc = coachDocs.docs[0];

          // Mettez à jour le document du coach avec les clés "domaine" et "sousDomaine"
          const coachDocRef = doc(db, "utilisateurs", coachDoc.id);
          await updateDoc(coachDocRef, {
            domaine: domaine,
            sousDomaine,
          });

          alert("Assignation réussie !");
        } else {
          alert("Aucun document de coach trouvé avec l'e-mail spécifié.");
        }
      } catch (error) {
        console.error("Erreur lors de l'assignation :", error);
        alert("Erreur lors de l'assignation. Veuillez réessayer.");
      }
    } else {
      alert("Aucun coach sélectionné. Veuillez sélectionner un coach.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les domaines
        const domaineCollection = collection(db, "domaines");
        const domainesSnapshot = await getDocs(domaineCollection);
        const domainesData = domainesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDomaines(domainesData);

        // Charger les utilisateurs (coachs)
        const collectionUtilisateurs = collection(db, "utilisateurs");
        const utilisateursSnapshot = await getDocs(collectionUtilisateurs);
        const utilisateursData = utilisateursSnapshot.docs.map((doc) =>
          doc.data()
        );
        setUsers(utilisateursData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    if (db) {
      loadData();
    } else {
      console.error(
        "Erreur: La base de données Firebase n'est pas initialisée."
      );
    }
  }, [db]);

  // Générer les options pour MultiCascader
  const options = domaines.map((domaine) => ({
    label: domaine.domaine,
    value: domaine.domaine, // Utiliser la valeur du domaine comme "value"
    children: Object.keys(domaine.sousDomaine).map((sousDomaineKey) => {
      const sousDomaine = domaine.sousDomaine[sousDomaineKey];

      // Filtrer les coachs correspondant à ce sous-domaine
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

  return (
    <div>
      <div className="mt-5" style={{ marginBottom: "300px" }}>
        <MultiCascader
          style={{ width: 480 }}
          data={options}
          cascade={false}
          onChange={setValue}
          value={value}
          appearance="default"
          menuWidth={"220px"}
          placeholder="Assigner un domaine à un coach"
        />
      </div>

      <div>
        <button className="btn btn-primary w-100" onClick={handleAssign}>
          Assigner
        </button>
      </div>
    </div>
  );
}
