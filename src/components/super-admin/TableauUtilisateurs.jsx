import React, { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { FaEye, FaEdit, FaArchive } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function TableauUtilisateurs() {
  // États pour gérer les données et les interactions
  const [utilisateursData, setUtilisateursData] = useState([]); // Stocke les données des utilisateurs
  const [infoVisible, setInfoVisible] = useState(false); // Gère la visibilité du dialogue d'informations
  const [formVisible, setFormVisible] = useState(false); // Gère la visibilité du formulaire de mise à jour
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null); // Stocke l'utilisateur sélectionné
  const [selectedUtilisateursForUpdate, setSelectedUtilisateursForUpdate] =
    useState(null); // Stocke l'utilisateur pour la mise à jour
  const [loading, setLoading] = useState(false); // Gère l'état de chargement

  // Ajoutez un nouvel état local pour gérer l'étiquette du bouton
  const [archiveLabel, setArchiveLabel] = useState("Archiver");

  // États pour chaque champ du formulaire de modification
  const [nameValue, setNameValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [addresseValue, setAddresseValue] = useState("");

  // Affiche les détails de l'utilisateur sélectionné
  const showDetails = (utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setInfoVisible(true);
  };

  // Affiche le formulaire de mise à jour avec les informations de l'utilisateur sélectionné
  const showUpdateForm = (utilisateur) => {
    setSelectedUtilisateursForUpdate(utilisateur);
    setNameValue(utilisateur.name);
    setNumberValue(utilisateur.number);
    setEmailValue(utilisateur.email);
    setAddresseValue(utilisateur.addresse);
    setFormVisible(true);
  };

  // Récupère les données de l'utilisateurs depuis Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "utilisateurs"));
      const utilisateurs = [];
      querySnapshot.forEach((doc) => {
        utilisateurs.push({ UserId: doc.id, ...doc.data() });
      });
      setUtilisateursData(utilisateurs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Met à jour les informations de l'utilisateur sélectionné dans Firestore
  const handleUpdateStudent = async () => {
    if (!selectedUtilisateursForUpdate) return;

    const utilisateursRef = collection(db, "utilisateurs");
    const utilisateurDoc = doc(
      utilisateursRef,
      selectedUtilisateursForUpdate.UserId
    );

    try {
      await updateDoc(utilisateurDoc, {
        name: nameValue,
        number: numberValue,
        email: emailValue,
        addresse: addresseValue,
      });

      setFormVisible(false);
      fetchData(); // Met à jour les données après la modification
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Gère le chargement simulé
  const load = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Effectue la souscription aux modifications des données Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "utilisateurs"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            fetchData(); // Mise à jour des données lorsqu'un nouvel utilisateur est ajouté
          }
        });
      }
    );

    fetchData(); // Récupération initiale des données

    return () => {
      unsubscribe(); // Nettoyage du listener lors du démontage du composant
    };
  }, []);

  // Fonction pour gérer l'archivage et le désarchivage
  const handleArchiveToggle = async (utilisateurId, isArchived) => {
    const utilisateursRef = collection(db, "utilisateurs");
    const utilisateurDoc = doc(utilisateursRef, utilisateurId);

    try {
      await updateDoc(utilisateurDoc, {
        archiver: !isArchived,
      });
      fetchData(); // Met à jour les données après l'archivage ou le désarchivage
      // Mettre à jour l'étiquette du bouton en fonction du nouvel état 'archiver'
      setArchiveLabel(!isArchived ? "Désarchiver" : "Archiver");
    } catch (error) {
      console.error("Error archiving student:", error);
    }
  };

  // Définition des colonnes pour le tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Prenom & Nom",
        size: 150,
      },
      {
        accessorKey: "number",
        header: "Téléphone",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "addresse",
        header: "Adresse",
        size: 150,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        // size: 100,
      },
    ],
    []
  );

  // Prépare les données pour le tableau
  const data = useMemo(() => {
    return utilisateursData.map((utilisateur) => ({
      id: utilisateur.UserId,
      name: utilisateur.name,
      number: utilisateur.number,
      email: utilisateur.email,
      addresse: utilisateur.addresse,
      actions: (
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill me-3"
            onClick={() => showDetails(utilisateur)}
          >
            <FaEye className="me-1" style={{ width: "20px", height: "20px" }} />
            Voir
          </button>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill me-3"
            onClick={() => {
              showUpdateForm(utilisateur);
              setFormVisible(true);
            }}
          >
            <FaEdit
              className="me-1"
              style={{ width: "20px", height: "20px" }}
            />
            Modifier
          </button>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill me-3"
            onClick={() =>
              handleArchiveToggle(utilisateur.id, utilisateur.archiver || false)
            }
          >
            <FaArchive
              className="me-1"
              style={{ width: "20px", height: "20px" }}
            />
            {utilisateur.archiver ? "Désarchiver" : "Archiver"}
          </button>
        </div>
      ),
    }));
  }, [utilisateursData]);

  // Utilisation du hook pour la gestion du tableau
  const table = useMaterialReactTable({
    columns,
    data,
  });

  // Rendu du composant
  return (
    <>
      {/* Dialogue pour afficher les détails de l'utilisateur */}
      <Dialog
        header={`Informations sur ${
          selectedUtilisateur ? selectedUtilisateur.name : ""
        }`}
        visible={infoVisible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setInfoVisible(false)}
        className="w-md-50 w-sm-100"
      >
        {selectedUtilisateur && (
          <div className="infoUtilisateurs d-flex flex-md-row flex-sm-column justify-content-around align-items-center">
            <div className="photoProfil mb-md-0 mb-sm-4 ">
              <img
                // src={sim}é
                alt={selectedUtilisateur.name}
                className="rounded-circle"
              />
            </div>
            <div className="infos">
              <p>
                <span className="fw-bold">Prenom & Nom : </span>
                {selectedUtilisateur.name}
              </p>
              <p>
                <span className="fw-bold">Adresse email : </span>
                {selectedUtilisateur.email}
              </p>
              <p>
                <span className="fw-bold">Numéro de téléphone : </span>
                {selectedUtilisateur.number}
              </p>
              <p>
                <span className="fw-bold">Adresse de domicile : </span>
                {selectedUtilisateur.addresse}
              </p>
            </div>
          </div>
        )}
      </Dialog>

      {/* Formulaire de mise à jour */}
      <Dialog
        header={`Mis à jour du profil`}
        visible={formVisible}
        style={{ width: "50vw" }}
        onHide={() => setFormVisible(false)}
      >
        <form
          action=""
          className="formUpdate d-flex flex-column justify-content-center align-items-center"
        >
          <h6 className="mb-5">Mise à jour du profil</h6>
          <div className="p-float">
            <span className="p-float-label my-5">
              <InputText
                id="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
              <label htmlFor="name">Prénom & Nom</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                keyfilter="int"
                id="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
              />
              <label htmlFor="number">Téléphone</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="addresse"
                value={addresseValue}
                onChange={(e) => setAddresseValue(e.target.value)}
              />
              <label htmlFor="addresse">Adresse</label>
            </span>
          </div>
          <div className="card flex flex-wrap justify-content-center gap-3">
            <Button
              rounded
              label="Mis à jour"
              icon="pi pi-check"
              loading={loading}
              onClick={() => {
                load();
                handleUpdateStudent();
              }}
            />
          </div>
        </form>
      </Dialog>

      {/* Affichage du tableau */}
      <div className="TableUtilisateurs d-flex flex-column justyfy-content-center align-items-center w-100">
        <h1 className="my-3 shadowTable">Tableaux utilisateur</h1>
        <div className="myTable ">
          <MaterialReactTable table={table} className="" />
        </div>
      </div>
    </>
  );
}