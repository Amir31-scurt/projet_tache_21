import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoTech from "../../../assets/images/logo.png";
import { MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { Dropdown } from "rsuite";
import { FaUserCog } from "react-icons/fa";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import ModalComponent from "./ModalComponent";
import NavBarContext from "./context";
import { auth } from "../../../config/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const NavBarCompo = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Deconnexion
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Fin Deconnexion

  return (
    <NavBarContext.Provider value={{ open, handleOpen, handleClose }}>
      <div className="mt-">
        {/*============NavBar============= */}
        <div className="NavBarContainer d-flex">
          <div className="LogoConta d-flex align-items-center justify-content-center">
            <div className="LogoConta2">
              <img src={LogoTech} alt="Le Logo" className="img-fluid LOGONAV" />
              <h3 className=" d-none d-lg-block text-white ms-2 mt-2">
                TechGenius
              </h3>
            </div>
          </div>
          {/*=====================SECOND PARTIE DU NavBar Debut============= */}
          <div className="SecRightNav">
            <div className="Lbtn me-5 me-sm-3 ">Livrer une tache</div>
            <div className="MessageIcone d-flex align-items-center justify-content-center">
              <MdMessage className="fs-4" />
            </div>
            <div className="NotifIcone d-flex align-items-center justify-content-center me-3">
              <div className="">
                <IoNotifications className="fs-4" />
              </div>
            </div>

            {/*================Icone du DropDown========= */}
            <Dropdown
              title={
                <TbTriangleInvertedFilled
                  className="fs-5"
                  style={{ color: "#d4f1f4" }}
                />
              }
              placement="bottomEnd"
              noCaret
              className="me-5"
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
          <ModalComponent />
          {/*====== Le Bouton Modal  ======*/}
        </div>
      </div>
    </NavBarContext.Provider>
  );
};
