import React, { useContext, useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoTech from "../../../assets/images/logo.png";
import UserProfil from "../../../assets/images/user.png";
import { Dropdown } from "rsuite";
import { FaUserCog } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import ModalComponent from "./ModalComponent";
import NavBarContext from "./context";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "../../../config/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { EmailContext } from "../../../contexte/EmailContexte";
import Notifications from "./Notifications";
import {
  getDownloadURL,
  ref
} from "firebase/storage";

export const NavBarCompo = () => {
  // eslint-disable-next-line
  const { email, setEmail } = useContext(EmailContext);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(UserProfil);
  const navigate = useNavigate();

 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Utilisez useEffect pour mettre à jour l'image de profil après la reconnexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mettez à jour l'image de profil après la reconnexion
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        getDownloadURL(storageRef)
          .then((url) => {
            setProfileImage(url);
            localStorage.setItem("profileImage", url);
          })
          .catch((error) => {
            console.error("Error loading profile image:", error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setEmail("");
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.log(error);
    }
  };


  // Fin Deconnexion

  return (
    <NavBarContext.Provider value={{ open, handleOpen, handleClose }}>
      <div className="mt-">
        {/*============NavBar============= */}
        <div className="NavBarContainer shadow-sm d-flex">
          <div className="LogoConta d-flex align-items-center justify-content-center">
            <div className="LogoConta2 ">
              <div className="img-logo d-flex align-items-center justify-content-center">
                <img src={LogoTech} className="img-fluid " alt="" />
                <h3 className="GandalTitle" style={{ color: "#3084b5" }}>
                  Gaandal
                </h3>
              </div>
            </div>
          </div>
          {/*=====================SECOND PARTIE DU NavBar Debut============= */}
          <div className="SecRightNav">
            <div className="MessageIcone d-flex align-items-center justify-content-center"></div>
            <Notifications />

            {/*================Icone du DropDown========= */}
            <Dropdown
              title={
                <img
                  src={profileImage}
                  className="img-fluid ProfilSpace"
                  alt=""
                  style={{
                    width: "58px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              }
              placement="bottomEnd"
              noCaret
              className="me-4"
              appearance="subtle"
              toggleClassName="bg-transparent"
            >
              {/*===============Bouton Accès Profil=========*/}
              <Dropdown.Item onClick={handleOpen} className="fw-bold">
                <FaUserCog className="fs-5 IcoColor mx-1" /> Profile
              </Dropdown.Item>
              {/*===============Bouton Deconnexion=============== */}
              <Dropdown.Item className="fw-bold" onClick={logOut}>
                <IoMdLogOut className="fs-5 IcoColor mx-1" /> Déconnexion
              </Dropdown.Item>
            </Dropdown>
          </div>

          {/*====== Le Bouton Modal  ======*/}
          <ModalComponent
            onProfileImageChange={(newProfileImage) => {
              setProfileImage(newProfileImage);
              localStorage.setItem("profileImage", newProfileImage);
            }}
          />

          {/*====== Le Bouton Modal  ======*/}
        </div>
      </div>
    </NavBarContext.Provider>
  );
};
