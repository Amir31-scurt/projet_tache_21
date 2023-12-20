import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function FormConnect() {
  // state pour le modal mot de pass oublier
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  // const handleHideModal = () => setOnHide(false);
  // render login
  return (
    <form>
      <div className=" tire mb-4">
        <div className="input-group  flex-nowrap">
          <span class="input-group-text" id="addon-wrapping">
            <CiMail />
          </span>
          <input
            type="email"
            class="form-control "
            placeholder="Email"
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
      </div>

      <div className=" tire ">
        <div className="input-group mb-3  flex-nowrap">
          <span class="input-group-text" id="addon-wrapping">
            <RiLockPasswordFill />
          </span>
          <input
            type="password"
            class="form-control "
            placeholder="Password"
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        <Link
            to="/Modal"
            onClick={handleShowModal}
            className="text-decoration-none"
          >
            <p className="m-0 p-0 text-end oubli">Mot de passe oublié?</p>
          </Link>

        <div className="pt-1 mt-4 text-end">
          <center>
          <button class="btn  d-flex justify-content-center align-items-center fs-6 btn-lg btn-block text-white  log" type="button">Connecter</button>
          </center>
        </div>
    </div>
    </form>
  )
}
