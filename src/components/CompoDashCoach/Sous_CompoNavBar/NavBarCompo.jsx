import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer le fichier CSS de Bootstrap
import LogoTech from '../../../assets/images/Logo.png';
import UserProfil from '../../../../src/assets/images/user.png';
import { MdMessage } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { Modal, Button, ButtonToolbar, Placeholder } from "rsuite";
import { FaUserEdit } from "react-icons/fa";
import { Input, InputGroup } from "rsuite";
import AvatarIcon from "@rsuite/icons/legacy/Avatar";
import { MdAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { Dropdown } from "rsuite";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { TbTriangleInvertedFilled } from "react-icons/tb";





export const NavBarCompo = () => {
  //L'etatat de l'ouverture et de Fermeture du Modal__debut
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  //L'etatat de l'ouverture et de Fermeture du Modal__Fin

    const [visible, setVisible] = React.useState(false);

    const handleChange = () => {
      setVisible(!visible);
    };

  return (
    <div>
      <div className="mt-">
        {/*============NavBar============= */}
        <div className="NavBarContainer d-flex">
          <div className="LogoConta d-flex align-items-center justify-content-center">
            <div className="LogoConta2">
              <img src={LogoTech} alt="Le Logo" className="img-fluid LOGONAV" />
              <h3 className=" d-none d-lg-block text-white ms-2">TechGenius</h3>
            </div>
          </div>
          {/*=====================SECOND PARTIE DU NavBar Debut============= */}
          <div className="SecRightNav">
            <div className="MessageIcone d-flex align-items-center justify-content-center">
              <MdMessage className="fs-4" />
            </div>
            <div className="NotifIcone d-flex align-items-center justify-content-center me-3">
              <div className="">
                <IoNotifications className="fs-4" />
              </div>
            </div>

            {/*================Icone du Profil========= */}

            <div className="ProfilSpace me-5" onClick={handleOpen}>
              <input
                type="image"
                src={UserProfil}
                className="ProfilUser img-fluid"
              />
            </div>
            <Dropdown
              title={<TbTriangleInvertedFilled/>}
              placement="bottomEnd"
              noCaret
            >
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>About</Dropdown.Item>
            </Dropdown>

            {/*================Debut du Modal========= */}

            <Modal open={open} onClose={handleClose}>
              <Modal.Header>
                <Modal.Title className="text-center fw-bold text-secondary fst-italic">
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
                    <FaUserEdit className="fs-5 EditUser " />
                  </button>
                  {/*===============Bouton Modifier le Profil Fin========= */}
                </div>

                <div className="w-100 mt-2">
                  <h4 className="PrenomUser fs-5 text-center  text-secondary fst-italic">
                    Prenom Nom
                  </h4>
                  <h4 className="EmailUser fs-6 text-center text-secondary fst-italic">
                    Email@gmail.com
                  </h4>
                </div>

                <div className="my-3 ContImputUser">
                  <InputGroup className="mb-2 order border-3">
                    <InputGroup.Addon>
                      <MdAlternateEmail className="IcoColor" />
                    </InputGroup.Addon>
                    <Input className="" />
                  </InputGroup>

                  <InputGroup className="mb-2 order border-3">
                    <InputGroup.Addon>
                      <AvatarIcon className="IcoColor" />
                    </InputGroup.Addon>
                    <Input className="border border-0" />
                  </InputGroup>

                  <InputGroup className="mb-2 order border-3">
                    <InputGroup.Addon>
                      <MdOutlinePassword className="IcoColor" />
                    </InputGroup.Addon>
                    <Input
                      className="border border-0"
                      type={visible ? "text" : "password"}
                    />
                    <InputGroup.Button onClick={handleChange}>
                      {visible ? <EyeIcon /> : <EyeSlashIcon />}
                    </InputGroup.Button>
                  </InputGroup>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  onClick={handleClose}
                  className="SaveModifBtn py-2 px-3 me-2"
                >
                  Modifier
                </button>
                <button
                  onClick={handleClose}
                  className="CancelModifBtn py-2 px-3"
                >
                  Annuler
                </button>
              </Modal.Footer>
            </Modal>

            {/*================Fin du Modal========= */}
          </div>
          {/*=====================SECOND PARTIE DU NavBar Fin============= */}
        </div>
      </div>
    </div>
  );
};
