import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function FormConnect() {
  // Les hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  // UseNavigate pour les redirections
  const navigate = useNavigate();

  // les changements dans les champs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Fonction pour la connexion / login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      setEmail("");
      setPassword("");

      navigate("/dashboardEtudiant");
    } catch (error) {
      toast.error("Échec de la connexion. Veuillez vérifier vos informations.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div class="card-body justify-content-center  p-lg-5 text-black">
        <div class="d-flex  mb-5 justtify-content-center   bouton-switch  ">
          <button type="button" class="btn  tir text-white ">
            Login
          </button>
          <Link to="/">
            <button type="button" class="btn  tir text-white ">
              Register
            </button>
          </Link>
        </div>
        <form onSubmit={handleLogin}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
            recusandae
          </p>
          <div class=" tire mb-4">
            <div class="input-group  flex-nowrap">
              <span class="input-group-text" id="addon-wrapping">
                <CiMail />
              </span>
              <input
                type="email"
                class="form-control"
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
                placeholder="Password"
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>
          <Link
            to="/Modal"
            className="text-decoration-none"
          >
            <p className="m-0 p-0 text-start oubli">Mot de passe oublié?</p>
          </Link>

          <div class="pt-1 mt-4 text-end ">
            <button
              type="submit"
              className="btn btn-primary btn-md"
              onClick={handleLogin}
            >
              {/* Loader */}
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </form>
      </div>{" "}
    </div>
  );
}
