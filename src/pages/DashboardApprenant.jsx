import React from "react";
import userProfile from "../assets/images/userProfile.png";

export default function DashboardApprenant() {
  return (
    <div className="container-fluid d-flex justify-content-center DashboardApprenant-contener">
      <div className="row bg-light card fil actualite w-50">
        <div className="col-md-10 d-flex justify-content-center align-items-center p-3 ">
          <img src={userProfile} alt="profil" className="icon" />
          <span className="d-flex justify-content-around">
            <h5>Non et Prenom de l'apprenant</h5>
            <p>heure de livraison</p>
          </span>
        </div>
      </div>
    </div>
  );
}
