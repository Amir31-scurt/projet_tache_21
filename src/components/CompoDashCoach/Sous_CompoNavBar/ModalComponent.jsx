import React, { useContext, useEffect, useState, useRef } from "react";
import NavBarContext from "./context";
import { Modal } from "rsuite";
import { FaUserEdit } from "react-icons/fa";
import UserProfil from "../../../../src/assets/images/user.png";
import { ToastContainer, toast } from "react-toastify";
import {
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, storage, db } from "../../../config/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";

const ModalComponent = ({ onProfileImageChange }) => {
  const { open, handleClose } = useContext(NavBarContext);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // Récupérer les identifiants de l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        // Récupérer l'URL de téléchargement de l'image de profil depuis Firebase Storage
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        getDownloadURL(storageRef)
          .then((url) => setProfileImage(url))
          .catch((error) => {
            console.error("Error loading profile image:", error.message);
          });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fonction pour mettre à jour la photo de profil
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setTempProfileImage(profileImage);

    // Charger l'image vers Firebase Storage
    const storageRef = ref(storage, `profile_images/${user.uid}`);
    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef).then((url) => setProfileImage(url));
      })
      .catch((error) => {
        console.error("Error uploading profile image:", error.message);
        toast.error("Erreur lors de la mise à jour de la photo de profil.");
      });
  };

  const handleCancelChanges = () => {
    // Vérifier s'il y a eu des modifications
    const isProfileImageChanged = tempProfileImage !== profileImage;
    const isNameChanged = newDisplayName.trim() !== "";
    const isPasswordChanged =
      newPassword.trim() !== "" || currentPassword.trim() !== "";

    // Vérifier si les données du profil ont changé
    if (isProfileImageChanged || isNameChanged || isPasswordChanged) {
      setTempProfileImage(null);
      setNewDisplayName("");
      setCurrentPassword("");
      setNewPassword("");
      handleCloseModal();
    } else {
      handleCloseModal();
    }
  };

  // Mettre à jour le profil
  const handleUpdateProfile = async () => {
    try {
      if (!user) {
        toast.error("Utilisateur non connecté !");
        return;
      }

      // Vérifier s'il y a des modifications à apporter
      const isNameChanged = newDisplayName.trim() !== "";
      const isPasswordChanged =
        newPassword.trim() !== "" && currentPassword.trim() !== "";

      // Si aucune modification n'est nécessaire, fermer simplement le modal
      if (!isNameChanged && !isPasswordChanged) {
        handleCloseModal();
        return;
      }

      // Mettre à jour le nom si le champ est rempli
      if (isNameChanged) {
        await updateProfile(user, { displayName: newDisplayName });
      }

      // Re-authentifier l'utilisateur seulement si le mot de passe est modifié
      if (isPasswordChanged) {
        const credentials = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credentials);

        // Mettre à jour le mot de passe
        await updatePassword(user, newPassword);
      }

      // Fermer le modal
      handleCloseModal();

      // Réinitialiser les champs après la mise à jour réussie
      setNewDisplayName("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating profile:", error.message);

      // Vérifier si la mise à jour s'est effectuée dans Firebase
      const updatedUser = auth.currentUser;
      if (
        updatedUser.displayName === newDisplayName &&
        updatedUser.email === user.email
      ) {
        // Mise à jour effectuée dans Firebase
      } else {
        const userDocRef = doc(db, "utilisateurs", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          await updateDoc(userDocRef, {
            displayName: newDisplayName,
            newPassword: newPassword,
          });
        } else {
          toast.error("Document utilisateur non trouvé !");
        }
      }
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  const handleCloseModal = () => {
    if (tempProfileImage) {
      onProfileImageChange(tempProfileImage);
      toast.success("Modifications enregistrées avec succès !");
    }

    // Fermer le modal
    handleClose();
  };

  // Fonction pour activer le mode d'édition
  const handleEditProfile = () => {
    setIsEditing(true);
    fileInputRef.current?.click();
  };

  // Affichage
  return (
    <div>
      <ToastContainer />
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title
            style={{ color: "#3084b5" }}
            className="text-center fw-bold fst-italic"
          >
            Modifier le Profil
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center w-100">
            <div className="ProfilSpace2">
              <img
                src={profileImage || UserProfil}
                className="ProfilUser img-fluid"
                alt="Profil de l'utilisateur"
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
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
            <div className="flex justify-content-center mb-3">
              {" "}
              <InputText
                placeholder="Nouveau Nom ici"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
            </div>
            <div className="flex justify-content-center mb-3">
              {" "}
              <Password
                value={currentPassword}
                placeholder="Mot de passe actuel"
                onChange={(e) => setCurrentPassword(e.target.value)}
                toggleMask
              />
            </div>
            <div className="flex justify-content-center">
              {" "}
              <Password
                value={newPassword}
                placeholder="Nouveau mot de passe"
                onChange={(e) => setNewPassword(e.target.value)}
                toggleMask
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={handleUpdateProfile}
            style={{ backgroundColor: "#3084b5" }}
            className="btn py-2 px-3 me-2"
          >
            Modifier
          </button>
          <button
            onClick={handleCancelChanges}
            className="btn btn-secondary py-2 px-3"
          >
            Annuler
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalComponent;
