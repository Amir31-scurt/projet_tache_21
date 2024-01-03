import React, { useContext, useEffect, useState, useRef } from "react";
import NavBarContext from "./context";
import { Modal } from "rsuite";
import { FaUserEdit } from "react-icons/fa";
import UserProfil from "../../../../src/assets/images/user.png";
import FormComponent from "./FormComponent";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "../../../config/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ModalComponent = ({ onProfileImageChange }) => {
  const { open, handleClose } = useContext(NavBarContext);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // L'utilisateur est connecté
        setUser(user);

        // Récupérer l'URL de téléchargement de l'image de profil depuis Firebase Storage
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        getDownloadURL(storageRef)
          .then((url) => setProfileImage(url))
          .catch((error) => {
            // Gérer les erreurs liées au chargement de l'image
            console.error("Error loading profile image:", error.message);
          });
      } else {
        // L'utilisateur n'est pas connecté
        setUser(null);
      }
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, []); // A

  // Fonction pour mettre à jour la photo de profil
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];

    // Stocker temporairement l'image de profil
    setTempProfileImage(profileImage);

    // Charger l'image vers Firebase Storage
    const storageRef = ref(storage, `profile_images/${user.uid}`);
    uploadBytes(storageRef, file)
      .then(() => {
        // Rafraîchir l'URL de la photo de profil après le téléchargement
        getDownloadURL(storageRef).then((url) => setProfileImage(url));
        toast.success("Photo de profil mise à jour avec succès !");
      })
      .catch((error) => {
        // Gérer les erreurs liées au téléchargement de l'image
        console.error("Error uploading profile image:", error.message);
        toast.error("Erreur lors de la mise à jour de la photo de profil.");
      });
  };

  const handleCancelChanges = () => {
    // Annuler les changements et restaurer l'image de profil temporaire
    setProfileImage(tempProfileImage);
    setTempProfileImage(null);
  };

  const handleCloseModal = () => {
    if (tempProfileImage) {
      // Valider les changements lors de la fermeture seulement si des changements temporaires existent
      onProfileImageChange(profileImage);
      toast.success("Modifications enregistrées avec succès !");
    }

    // Fermer le modal
    handleClose();
  };

  // Fonction pour activer le mode d'édition
  const handleEditProfile = () => {
    setIsEditing(true);
    fileInputRef.current.click();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title
          style={{ color: "#3084b5" }}
          className="text-center fw-bold fst-italic"
        >
          Modifier le Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center w-100">
          <div className="ProfilSpace2">
            <img
              src={profileImage || UserProfil}
              className="ProfilUser img-fluid"
              alt="Profil de l'utilisateur"
            />
            {isEditing ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
              />
            ) : null}
          </div>
          <button className="EditBtn" onClick={handleEditProfile}>
            <FaUserEdit className="fs-5 text-secondary " />
          </button>
        </div>
        <div className="w-100 mt-2">
          <h4 className="PrenomUser fs-5 text-center  text-secondary fst-italic">
            {user ? user.displayName : "Nom non disponible"}
          </h4>
          <h4 className="EmailUser fs-6 text-center text-secondary fst-italic">
            {user ? user.email : "Email non disponible"}
          </h4>
        </div>
        <div className="my-3 ContImputUser">
          {/*============ Le Formulaire ========= */}
          <FormComponent />
          {/*============ Le Formulaire ========= */}
        </div>
      </Modal.Body>

      <Modal.Footer>
        {/*====== Bouton Sauvegarder Modifications Profil ====== */}
        <button
          onClick={handleCloseModal}
          style={{ backgroundColor: "#3084b5" }}
          className="btn py-2 px-3 me-2"
        >
          Modifier
        </button>

        {/*====== Bouton Annuler Modifications Profil ====== */}
        <button
          onClick={handleCancelChanges}
          className="btn btn-secondary py-2 px-3"
        >
          Annuler
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
