/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Toaster, toast } from 'react-hot-toast';
import sim from '../../assets/images/sim.jpeg';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { FaEye, FaEdit } from 'react-icons/fa';
import { TbArchiveFilled, TbArchiveOff } from 'react-icons/tb';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import user from '../../assets/images/user.png';

import AddUser from './AddUser';

export default function TableauUtilisateurs() {
  const [utilisateursData, setUtilisateursData] = useState([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null);
  const [selectedUtilisateursForUpdate, setSelectedUtilisateursForUpdate] =
    useState(null); // Stocke l'utilisateur pour la mise à jour
  const [loading, setLoading] = useState(false); // Gère l'état de chargement
  // Ajoutez un nouvel état local pour gérer l'étiquette du bouton
  const [archiveLabel, setArchiveLabel] = useState('Archiver');

  // États pour chaque champ du formulaire de modification
  const [nameValue, setNameValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [roleValue, setRoleValue] = useState('');
  const [notificationsCollection] = useState(collection(db, 'notifications'));
  const [roleFilter, setRoleFilter] = useState('Tous les utilisateurs');
  const [tabType, setTabType] = useState('de bord');

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
      const querySnapshot = await getDocs(collection(db, 'utilisateurs'));
      const utilisateurs = [];
      querySnapshot.forEach((doc) => {
        utilisateurs.push({ id: doc.id, ...doc.data() });
      });
      setUtilisateursData(utilisateurs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Met à jour les informations de l'utilisateur sélectionné dans Firestore
  const handleUpdateStudent = async () => {
    if (!selectedUtilisateursForUpdate) return;

    const utilisateursRef = collection(db, 'utilisateurs');
    const utilisateurDoc = doc(
      utilisateursRef,
      selectedUtilisateursForUpdate.id
    );
    const user = utilisateursData.find(
      (user) => user.id === selectedUtilisateursForUpdate.id
    );
    let notificationMessageMisAJour = `Les information sur ${user.name} ont étaient mis a jour avec succes`;

    try {
      await updateDoc(utilisateurDoc, {
        name: nameValue,
        number: numberValue,
        email: emailValue,
        address: addressValue,
        role: roleValue,
      });
      toast.success(notificationMessageMisAJour, {
        duration: 4000,
      });
      setFormVisible(false);
      fetchData(); // Met à jour les données après la modification
    } catch (error) {
      console.error('Error updating student:', error);
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
      collection(db, 'utilisateurs'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
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
    try {
      const utilisateursRef = collection(db, 'utilisateurs');
      const utilisateurDoc = doc(utilisateursRef, utilisateurId);
      const user = utilisateursData.find((user) => user.id === utilisateurId);
      const coachs = utilisateursData.find(
        (coach) => coach.name === user.coach
      );
      let notificationMessage = `${user.name} a été ${
        !isArchived ? 'archivé' : 'désarchivé'
      } avec succes`;

      await updateDoc(utilisateurDoc, {
        archived: !isArchived, // Modifier l'attribut pour qu'il corresponde à "archived"
      });

      // Mise à jour des données seulement après la modification dans Firestore
      const updatedUtilisateursData = utilisateursData.map((utilisateur) =>
        utilisateur.id === utilisateurId
          ? { ...utilisateur, archived: !isArchived } // Correspondance avec l'attribut 'archived'
          : utilisateur
      );
      setUtilisateursData(updatedUtilisateursData);

      await addDoc(notificationsCollection, {
        messageForAdmin: notificationMessage,
        timestamp: serverTimestamp(),
        newNotif: true,
        email: coachs.email,
      });

      fetchData();

      setArchiveLabel(isArchived ? 'Désarchiver' : 'Archiver');
      toast.success(notificationMessage, {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error archiving student:', error);
    }
  };

  const filteredData = useMemo(() => {
    if (roleFilter === 'de bord') {
      return utilisateursData;
    } else if (roleFilter === 'Archivés') {
      return utilisateursData.filter((utilisateur) => utilisateur.archived);
    } else {
      return utilisateursData.filter(
        (utilisateur) => utilisateur.role === roleFilter
      );
    }
  }, [roleFilter, utilisateursData]);

  // Utilisez le stockage local pour sauvegarder et récupérer le filtre sélectionné
  const localStorageKey = 'roleFilter';

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
    if (selectedValue === 'de bord') {
      setTabType('de bord');
    } else if (selectedValue === 'Archivés') {
      setTabType('des utilisateurs archivées');
    } else {
      setTabType(selectedValue);
    }

    setRoleFilter(selectedValue);
    localStorage.setItem(localStorageKey, selectedValue);
  };

  // Définition des colonnes pour le tableau
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nom',
        size: 150,
      },
      {
        accessorKey: 'number',
        header: 'Téléphone',
        size: 200,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
      },
      {
        accessorKey: 'addresse',
        header: 'Adresse',
        size: 150,
      },
      {
        accessorKey: 'role',
        header: 'Role (statut)',
        size: 150,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
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
        <div className={`d-flex align-items-center`}>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-3 me-3"
            onClick={() => showDetails(utilisateur)}
          >
            <FaEye className="" style={{ width: '18px', height: '18px' }} />
          </button>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-success rounded-3 me-3"
            onClick={() => {
              showUpdateForm(utilisateur);
              setFormVisible(true);
            }}
          >
            <FaEdit className="" style={{ width: '18px', height: '18px' }} />
          </button>
          <button
            type="button"
            className={`d-flex justify-content-center align-items-center btn btn-outline-warning rounded-3 me-3`}
            onClick={() =>
              handleArchiveToggle(utilisateur.id, utilisateur.archived || false)
            }
          >
            {utilisateur.archived ? (
              <TbArchiveFilled
                className=""
                style={{ width: '18px', height: '18px' }}
              />
            ) : (
              <TbArchiveOff
                className=""
                style={{ width: '18px', height: '18px' }}
              />
            )}
          </button>
        </div>
      ),
      className: utilisateur.archived ? 'tableRowArchived bg-info' : '',
    }));
    // eslint-disable-next-line
  }, [filteredData]);

  // Utilisation du hook pour la gestion du tableau
  const table = useMaterialReactTable({
    columns,
    data,
  });

  // Rendu du composant
  return (
    <>
      <Toaster />
      <Dialog
        header={`Informations sur ${
          selectedUtilisateur ? selectedUtilisateur.name : ''
        }`}
        visible={infoVisible}
        maximizable
        style={{ width: '50vw' }}
        onHide={() => setInfoVisible(false)}
        className="w-md-50 w-sm-100"
      >
        {selectedUtilisateur && (
          <div className="infoUtilisateurs d-flex flex-md-row flex-sm-column justify-content-around align-items-center">
            <div className="photoProfil mb-md-0 mb-sm-4 ">
              <img
                src={setSelectedUtilisateur?.photoURL || user}
                alt={selectedUtilisateur.name}
                className="rounded-circle"
                style={{ width: '200px' }}
              />
            </div>
            <div className="infos">
              <p>
                <span className="fw-bold">Prenom & Nom : </span>
                {selectedUtilisateur.name}
              </p>
              <p>
                <span className="fw-bold">Email : </span>
                {selectedUtilisateur.email}
              </p>
              <p>
                <span className="fw-bold">Téléphone : </span>
                {selectedUtilisateur.number}
              </p>
              <p>
                <span className="fw-bold">Adresse : </span>
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
        header={`Profil`}
        visible={formVisible}
        style={{ width: '50vw' }}
        onHide={() => setFormVisible(false)}
      >
        <form
          action=""
          className="formUpdate d-flex flex-column justify-content-center align-items-center"
        >
          <h6 className="mb-5">Mise à jour du profil</h6>
          <div className="p-float" style={{ width: '100%' }}>
            <span className="p-float-label my-5">
              <InputText
                id="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                style={{ width: '100%' }}
              />
              <label htmlFor="name">Prénom & Nom</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                keyfilter="int"
                id="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                style={{ width: '100%' }}
              />
              <label htmlFor="number">Téléphone</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={{ width: '100%' }}
              />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="address"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
                style={{ width: '100%' }}
              />
              <label htmlFor="address">Adresse</label>
            </span>
          </div>
          <div className="card flex flex-wrap justify-content-center p-0">
            <Button
              className="m-0 text-light"
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
          Tableau <span>{tabType}</span>
        </h1>
        <div className="myTable ">
          <div className="add filter d-flex justify-content-start align-items-center">
            <select
              className="form-select w-25 my-3 me-3"
              aria-label="Default select example"
              value={roleFilter}
              onChange={handleFilterChange}
            >
              <option value="de bord">Tous les utilisateurs</option>
              <option value="Administrateur">Administrateurs</option>
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
