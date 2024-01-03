import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoTech from "../../../assets/images/logo.png";
import UserProfil from "../../../assets/images/user.png";
import { MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { Dropdown } from "rsuite";
import { FaUserCog } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import ModalComponent from "./ModalComponent";
import NavBarContext from "./context";
import { auth } from "../../../config/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { EmailContext } from "../../../contexte/EmailContexte";

export const NavBarCompo = () => {
  const { email, setEmail } = useContext(EmailContext);
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(UserProfil);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getProfileImageFromLocalStorage = () => {
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
  };

  useEffect(() => {
    getProfileImageFromLocalStorage();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setEmail("");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("profileImage");
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
            <div className="MessageIcone d-flex align-items-center justify-content-center">
              <MdMessage className="fs-4" style={{ color: "#3084b5" }} />
            </div>
            <div className="NotifIcone d-flex align-items-center justify-content-center me-2">
              <div className="">
                <IoNotifications
                  className="fs-4"
                  style={{ color: "#3084b5" }}
                />
              </div>
            </div>

            {/*================Icone du DropDown========= */}
            <Dropdown
              title={
                <img
                  src={profileImage}
                  className="img-fluid ProfilSpace"
                  alt=""
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
