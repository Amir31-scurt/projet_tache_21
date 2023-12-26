import React, { useState } from 'react';
// import affiche from "../assets/images/affiche.jpg";
import FormConnect from '../components/formConnect';
import Inscription from './Inscription';

export default function Connexion() {
  const state = 'true';
  const [connected, setConnected] = useState(state);

  return (
    <div class="container-fluid contain-connect  ">
      <div class="row d-flex justify-content-center align-items-center ">
        <div class="row g-0">
          <div class="height-img d-none d-lg-block col-0 col-lg-6">
            {/* <img
              src={affiche}
              alt="login form"
              className="img-fluid rounded-6"
            /> */}
          </div>
          <div className="height-form col">
            <div className="card-body  p-lg-5 text-black">
              <div
                className="d-flex  mb-5 justify-content-center align-items-center   bouton-switch border border-light p-2 rounded-pill "
                // style={{ background: "rgba(73, 187, 189, 0.6)" }}
              >
                <button
                  type="button"
                  className={`btn  justify-content-center align-items-center fs-6 text-white ${
                    connected ? 'active' : ''
                  }`}
                  onClick={() => {
                    setConnected(true);
                  }}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  className={`btn justify-content-center align-items-center  fs-6 text-white ${
                    !connected ? 'active' : ''
                  }`}
                  onClick={() => {
                    setConnected(false);
                  }}
                >
                  Inscription
                </button>
              </div>
              {connected ? <FormConnect /> : <Inscription />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
