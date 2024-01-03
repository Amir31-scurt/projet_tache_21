import React, { useState } from "react";

import { db } from "../../config/firebase-config";
import { collection, addDoc } from "firebase/firestore";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import ajouter from "../../assets/images/ajouter-un-utilisateur.png";

export default function AddUser({ reloadData }) {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    number: "",
    email: "",
    //   password: "",
    address: "",
    role: "Étudiant", // Valeur par défaut
    archiver: false,
    active: true,
  });

  const handleAddUser = async (e) => {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire
    try {
      const utilisateursRef = collection(db, "utilisateurs");
      await addDoc(utilisateursRef, userData);
      console.log("Utilisateur ajouté avec succès!");
      setVisible(false);
      reloadData(); // Rechargez les données après l'ajout d'utilisateur
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        onClick={() => setVisible(true)}
        style={{ cursor: "pointer" }}
      >
        <img
          className="rounded-pill border"
          src={ajouter}
          alt=""
          style={{ width: "30px", height: "30px" }}
        />
        <p className="m-0 px-2">Ajouter</p>
      </div>
      <Dialog
        header="Nouvel utilisateur"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <form
          action=""
          className="formAdd d-flex flex-column justify-content-center align-items-center"
        >
          <h6 className="mb-5">Ajouter utilisateur</h6>
          <div className="p-float" style={{ width: "100%" }}>
            <span className="p-float-label my-5">
              <InputText
                id="name"
                value={userData.name}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <label htmlFor="name">Prénom & Nom</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                keyfilter="int"
                id="number"
                value={userData.number}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <label htmlFor="number">Téléphone</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="email"
                value={userData.email}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label my-5">
              <InputText
                id="address"
                value={userData.address}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
              <label htmlFor="address">Adresse</label>
            </span>
            <span className="p-float-label my-5">
              <select
                className="form-select my-3"
                aria-label="Default select example"
                id="role"
                value={userData.role}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
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
              label="Ajouter"
              icon="pi-plus-cercle"
              onClick={(e) => handleAddUser(e)}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
