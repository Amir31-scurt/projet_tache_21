import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importer le fichier CSS de Bootstrap
import LogoTech from "../../../../src/assets/images/logo_transparent.png";
import UserProfil from "../../../../src/assets/images/user.png";
import { MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
// import "bootstrap/dist/js/bootstrap.bundle";

export const NavBarCompo = () => {
  return (
    <div>
      <div className="">
        {/*============NavBar============= */}
        <div className="NavBarContainer d-flex">
          <div className="LogoConta d-flex align-items-center justify-content-center ">
            <div className="LogoConta2">
              <img src={LogoTech} alt="Le Logo" className="img-fluid" />
            </div>
          </div>
          {/*=====================SECOND PARTIE DU NavBar============= */}
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

            <div
              className="ProfilSpace me-5"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <input
                type="image"
                src={UserProfil}
                className="ProfilUser img-fluid"
              />
            </div>

            {/*================Debut du Modal========= */}

            <div
              class="modal fade"
              id="staticBackdrop"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabindex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">
                      Le Titre Du modal
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  {/*================Le Contenu du Modal Debut========= */}

                  <div class="modal-body">...</div>

                  {/*================Le Contenu du Modal FIN========= */}

                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Fermer
                    </button>
                    <button type="button" class="btn btn-primary">
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*================Fin du Modal========= */}
          </div>
          {/*=====================SECOND PARTIE DU NavBar============= */}
        </div>
      </div>
    </div>
  );
};
