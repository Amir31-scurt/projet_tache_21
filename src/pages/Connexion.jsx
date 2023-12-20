import React, { useState } from "react";
import affiche from "../assets/images/affiche.jpg";
import FormConnect from "../components/formConnect";
import Inscription from "./Inscription";

export default function Connexion() {
  const state = "true";
  const [connected, setConnected] = useState(state);
  return (
    <div class="container-fluid contain-connect  ">
      <div class="row d-flex justify-content-center align-items-center ">
        <div class="row g-0 justify-content-arround">
          <div class=" height-img   col-lg-5 d-none d-md-block ">
            {/* <img
              src={affiche}
              alt="login form"
              className="img-fluid rounded-6"
            /> */}
          </div>
          <div className="col-lg-7 height-form d-flex justify-content-center">
            <div className="card-body justify-content-center p-lg-5 text-black">
              <div
                className="d-flex  mb-5 justtify-content-center   bouton-switch border border-light p-2 rounded-pill "
                style={{ background: "rgba(73, 187, 189, 0.6)" }}
              >
                <button
                  type="button"
                  className="btn  tir text-white"
                  onClick={() => {
                    setConnected(true);
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="btn  tir text-white"
                  onClick={() => {
                    setConnected(false);
                  }}
                >
                  Register
                </button>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat recusandae
              </p>
              {connected ? <FormConnect /> : <Inscription />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
