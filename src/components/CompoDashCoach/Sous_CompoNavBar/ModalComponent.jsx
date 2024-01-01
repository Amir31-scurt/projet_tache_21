import React, { useContext, useEffect, useState } from "react";
import NavBarContext from "./context";
import { Modal } from "rsuite";
import { FaUserEdit } from "react-icons/fa";
import UserProfil from "../../../../src/assets/images/user.png";
import FormComponent from "./FormComponent";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebase-config";

const ModalComponent = () => {
  const { open, handleClose } = useContext(NavBarContext);
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser({
          name: authUser.displayName,
          email: authUser.email,
          uid: authUser.uid,
        });

        try {
          // ...
        } catch (error) {
          toast.error("Error loading profile photo:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
            <input
              type="image"
              src={UserProfil}
              className="ProfilUser img-fluid"
            />
          </div>
          {/*===============Bouton Modifier le Profil debut========= */}
          <button
            className="EditBtn"
            onClick={() => alert("On Modifie Le profile ")}
          >
            <FaUserEdit className="fs-5 text-secondary " />
          </button>
          {/*===============Bouton Modifier le Profil Fin========= */}
        </div>

        <div className="w-100 mt-2">
          <h4 className="PrenomUser fs-5 text-center  text-secondary fst-italic">
            <p>{user.name}</p>
          </h4>
          <h4 className="EmailUser fs-6 text-center text-secondary fst-italic">
            <p>{user.email}</p>
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
          onClick={handleClose}
          style={{ backgroundColor: "#3084b5" }}
          className="btn py-2 px-3 me-2"
        >
          Modifier
        </button>

        {/*====== Bouton Annuler Modifications Profil ====== */}
        <button onClick={handleClose} className="btn btn-secondary py-2 px-3">
          Annuler
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
