import React, { useState } from "react";
// import affiche from "../assets/images/affiche.jpg";
import LogoTech from "../../assets/images/logo2.png";
import FormConnect from "../Connected/formConnect";

export default function Connexion() {
  const state = "true";
   // eslint-disable-next-line
  const [connected, setConnected] = useState(state);
  return (
    <div class="container-fluid contain-connect  ">
      <div class="row d-flex justify-content-center align-items-center ">
        <div class="row g-0">
          <div class="height-img d-none d-lg-block col-0 col-lg-6"></div>
          <div className="height-form  col">
            <div className="card-body  p-lg-5 text-black">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="imagel d-flex flex-column justify-content-center align-items-center">
                  <img src={LogoTech} className="img-fluid" alt="" />
                  <h3 style={{ color: "#3084b5" }}>Gaandal</h3>
                </div>
                <h3>Connectez-vous</h3>
              </div>
              {<FormConnect />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
