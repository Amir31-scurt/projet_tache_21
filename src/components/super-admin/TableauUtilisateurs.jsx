import React, { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import sim from "../../assets/images/sim.jpeg";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { FaEye, FaEdit, FaArchive } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import AddUser from "./AddUser";

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
  const [addressValue, setAddressValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [notificationsCollection] = useState(collection(db, "notifications"));
  const [roleFilter, setRoleFilter] = useState("Tous les utilisateurs");
  const [tabType, setTabType] = useState("utilisateurs");

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
    setAddressValue(utilisateur.address);
    setRoleValue(utilisateur.role);
    setFormVisible(true);
  };

  // Récupère les données de l'utilisateurs depuis Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "utilisateurs"));
      const utilisateurs = [];
      querySnapshot.forEach((doc) => {
        utilisateurs.push({ id: doc.id, ...doc.data() });
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
      selectedUtilisateursForUpdate.id
    );

    try {
      await updateDoc(utilisateurDoc, {
        name: nameValue,
        number: numberValue,
        email: emailValue,
        address: addressValue,
        role: roleValue,
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
            fetchData(); // Mettre à jour les données lorsqu'un nouvel utilisateur est ajouté
          }
        });
      }
    );

    fetchData(); // Récupération initiale des données
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Fonction pour gérer l'archivage et le désarchivage
  const handleArchiveToggle = async (utilisateurId, isArchived) => {
    const utilisateursRef = collection(db, "utilisateurs");
    const utilisateurDoc = doc(utilisateursRef, utilisateurId);
    const user = utilisateursData.find((user) => user.id === utilisateurId);
    const coachs = utilisateursData.find((coach) => coach.name === user.coach)
    let notificationMessage = `Votre étudiant ${user.name} a été ${!isArchived ? 'archivé': 'désarchivé'}`
    try {
      await updateDoc(utilisateurDoc, {
        archiver: !isArchived,
      });

      await addDoc(notificationsCollection, {
        messageForAdmin: notificationMessage,
        timestamp: serverTimestamp(),
        newNotif: true,
        email: coachs.email,
      });
      fetchData(); // Met à jour les données après l'archivage ou le désarchivage
      // Mettre à jour l'étiquette du bouton en fonction du nouvel état 'archiver'
      setArchiveLabel(isArchived ? "Désarchiver" : "Archiver");
    } catch (error) {
      console.error("Error archiving student:", error);
    }
  };

  const filteredData = useMemo(() => {
    if (roleFilter === "Tous les utilisateurs") {
      return utilisateursData;
    } else if (roleFilter === "Archivés") {
      return utilisateursData.filter((utilisateur) => utilisateur.archiver);
    } else {
      return utilisateursData.filter(
        (utilisateur) => utilisateur.role === roleFilter
      );
    }
  }, [roleFilter, utilisateursData]);

  // Utilisez le stockage local pour sauvegarder et récupérer le filtre sélectionné
  const localStorageKey = "roleFilter";

  // Au chargement du composant, vérifiez s'il y a une valeur de filtre enregistrée
  // Si oui, utilisez-la comme valeur initiale pour le filtre
  useEffect(() => {
    const savedFilter = localStorage.getItem(localStorageKey);
    if (savedFilter) {
      setRoleFilter(savedFilter);
    }
  }, []);

  // Mettez à jour le filtre sélectionné et sauvegardez-le dans le stockage local lorsqu'il est modifié
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    setRoleFilter(selectedValue);
    localStorage.setItem(localStorageKey, selectedValue);

    // Mettez à jour tabType en fonction de la valeur du filtre sélectionné
    if (selectedValue === "Archivés") {
      setTabType("utilisateurs archivées");
    } else {
      setTabType(selectedValue);
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
        accessorKey: "role",
        header: "Role (status)",
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
    return filteredData.map((utilisateur) => ({
      id: utilisateur.id,
      name: utilisateur.name,
      number: utilisateur.number,
      email: utilisateur.email,
      addresse: utilisateur.address,
      role: utilisateur.role,
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
  }, [filteredData]);

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
                src={sim}
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
                {selectedUtilisateur.address}
              </p>
              <p>
                <span className="fw-bold">Role : </span>
                {selectedUtilisateur.role}
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
          <div className="p-float" style={{ width: "100%" }}>
            <span className="p-float-label my-5">
              <InputText
                id="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                style={{ width: "100%" }}
              />
              <label htmlFor="name">Prénom & Nom</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                keyfilter="int"
                id="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                style={{ width: "100%" }}
              />
              <label htmlFor="number">Téléphone</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={{ width: "100%" }}
              />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="address"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
                style={{ width: "100%" }}
              />
              <label htmlFor="address">Adresse</label>
            </span>
            <span className="p-float-label my-5">
              <select
                className="form-select my-3"
                aria-label="Default select example"
                id="role"
                value={roleValue}
                onChange={(e) => setRoleValue(e.target.value)}
                style={{ width: "100%" }}
              >
                {/* <option value="Administrateur">{roleValue}</option> */}
                <option value="Administrateur">Administrateur</option>
                <option value="Coach">Coachs</option>
                <option value="Étudiant">Étudiants</option>
              </select>
              <label htmlFor="Role"></label>
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
        <h1 className="my-3 shadowTable">
          Tableaux <span>{tabType}</span>
        </h1>
        <div className="myTable ">
          <div className="add filter d-flex justify-content-start align-items-center">
            <select
              className="form-select w-25 my-3 me-3"
              aria-label="Default select example"
              value={roleFilter}
              onChange={handleFilterChange}
            >
              <option value="Tous les utilisateurs">
                Tous les utilisateurs
              </option>
              <option value="Administrateur">Administrateur</option>
              <option value="Coach">Coachs</option>
              <option value="Étudiant">Étudiants</option>
              <option value="Archivés">Archivés</option>
            </select>
            <AddUser reloadData={fetchData} />
          </div>
          <MaterialReactTable table={table} className="" />
        </div>
      </div>
    </>
  );
}
