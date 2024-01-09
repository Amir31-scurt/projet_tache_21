import React from "react";
import "../assets/css/notFound.css";
import { Link } from "react-router-dom";

function NotFound(props) {
  return (
    <div
      id="notFound"
      className="d-flex justify-content-center text-center my-auto"
    >
      <div
        className="d-flex flex-column
       justify-content-center align-items-center notFound"
      >
        <h1 className="error404">404</h1>
        <p className="fs-1 my-4 sorryText">
          Désolé! Cette page est introuvable.
        </p>
        <button
          type="submit"
          className="btn d-flex justify-content-center align-items-center fs-6 btn-lg btn-block col-7 text-white log"
        >
          <Link to={props.redirect} className="text-white link py-1">
            Retour à l'acceuil
          </Link>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
