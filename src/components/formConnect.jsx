import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormConnect() {
  // State pour gérer l'email, le mot de passe et le loading
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook de navigation 
  const navigate = useNavigate();

  // Fonctions pour gérer les changements dans les champs
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
      // Activation du chargement 
      setLoading(true);
      // Utilisation de Firebase pour la connexion
      await signInWithEmailAndPassword(auth, email, password);

      // Réinitialisation des champs email et mot de passe
      setEmail("");
      setPassword("");

      // Redirection vers la page du tableau de bord après la connexion réussie
      navigate("/dashboardEtudiant");
    } catch (error) {
      // Gestion des erreurs lors de la connexion
      toast.error("Échec de la connexion. Veuillez vérifier vos informations.");
      console.error(error);
    } finally {
      // Désactivation du chargement
      setLoading(false);
    }
  };

  return (
    <>

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin}>
         
          {/* Champ email avec icône */}
          <div className=" tire mb-4">
            <div className="input-group  flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                <CiMail />
              </span>
              <input
                type="email"
                className="form-control"
                onChange={handleEmailChange}
                placeholder="Email"
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>

          {/* Champ mot de passe avec icône */}
          <div className=" tire ">
            <div className="input-group mb-3  flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                <RiLockPasswordFill />
              </span>
              <input
                type="password"
                className="form-control "
                onChange={handlePasswordChange}
                placeholder="Password"
                aria-label="Username"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>

          {/* Lien vers la récupération de mot de passe */}
          <Link to="/Modal" className="text-decoration-none">
            <p className="m-0 p-0 text-start oubli">Mot de passe oublié?</p>
          </Link>

          {/* Bouton de connexion avec gestion du chargement */}
          <div className="pt-1 mt-4 text-end ">
            <button
              type="submit"
              className="btn btn-primary btn-md"
            >
              {/* Loader pendant le chargement */}
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
    
    </>
  );
}
