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
      <div class=" tire mb-4">
        <div class="input-group  flex-nowrap">
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

      <div class=" tire ">
        <div class="input-group mb-3  flex-nowrap">
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

        <div class="pt-1 mt-4 text-end">
          <center>
          <button class="btn  btn-lg btn-block text-white  log" type="button">Login</button>
          </center>
        </div>
    </div>
    </form>
  )
}
