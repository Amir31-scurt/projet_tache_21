import React from "react";
import userProfile from "../assets/images/userProfile.png";

export default function DashboardApprenant() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center DashboardApprenant-contener">
      <div className="row CardAppenant w-50 h-75">
        <div className="col-md-12 d-flex bg-light">
          <img src={userProfile} alt="" className="icon" />
          <h6>Cheikh Ahmed Tidiane Gueye</h6>
          <p>19 Dec.2023, 12:37</p>
        </div>
      </div>
    </div>
  );
}
