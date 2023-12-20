import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer le fichier CSS de Bootstrap
import LogoTech from '../../../assets/images/logo.png';
import UserProfil from '../../../../src/assets/images/user.png';
import { MdMessage } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { Modal, ButtonToolbar, Button, Loader, Placeholder } from 'rsuite';

export const NavBarCompo = () => {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000);
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
              <MdMessage className="fs-2" />
            </div>
            <div className="NotifIcone d-flex align-items-center justify-content-center me-3">
              <div className="">
                <IoNotifications className="fs-2" />
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

            {/*================Debut du Modal========= */}

            <Modal
              open={open}
              onClose={handleClose}
              onEntered={handleEntered}
              onExited={() => {
                setRows(0);
              }}
            >
              <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {rows ? (
                  <Placeholder.Paragraph rows={rows} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Loader size="md" />
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose} appearance="primary">
                  Ok
                </Button>
                <Button onClick={handleClose} appearance="subtle">
                  Cancel
                </Button>
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
