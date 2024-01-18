import React, { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase-config";

import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaArchive } from "react-icons/fa";

import { Dialog } from "primereact/dialog";

export default function TableEtudiants() {
  const [etudiantsData, setEtudiantsData] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "etudiants"));
        const etudiants = [];
        querySnapshot.forEach((doc) => {
          etudiants.push(doc.data());
        });
        setEtudiantsData(etudiants);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const unsubscribe = onSnapshot(collection(db, "etudiants"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          fetchData();
        }
      });
    });

    fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "Prenom",
        header: "Prenom & Nom",
        size: 150,
      },
      {
        accessorKey: "telephone",
        header: "Téléphone",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "adresse",
        header: "Adresse",
        size: 150,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 400,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: etudiantsData.map((etudiant) => ({
      Prenom: etudiant.Prenom,
      telephone: etudiant.Telephone,
      email: etudiant.email,
      adresse: etudiant.adresse,
      //   actions: "Boutons d'action (voir, modifier, archiver)"
      actions: (
        <div className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill"
            onClick={() => setVisible(true)}
          >
            <FaEye className="me-1" style={{ width: "10px", height: "10px" }} />
            Voir
          </button>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill"
          >
            <FaEdit
              className="me-1"
              style={{ width: "10px", height: "10px" }}
            />
            Modifier
          </button>
          <button
            type="button"
            className="d-flex justify-content-center align-items-center btn btn-outline-primary rounded-pill"
          >
            <FaArchive
              className="me-1"
              style={{ width: "10px", height: "10px" }}
            />
            Archiver
          </button>
        </div>
      ),
    })),
  });

  return (
    <div className="TableEtudiants d-flex flex-column justyfy-content-center align-items-center">
      <h1 className="my-3 shadowTable">Tableau étudiants</h1>
      <Dialog
        header="Informations sur ${etudiant.Prenom"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p>Informations sur l'etudiants</p>
      </Dialog>
      <MaterialReactTable table={table} className="m-5 tableShadow" />
    </div>
  );
}
