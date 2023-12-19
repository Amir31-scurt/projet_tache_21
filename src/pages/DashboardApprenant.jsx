import React from "react";
import userProfile from "../assets/images/userProfile.png";
import livraison from "../assets/images/livraison.jpg";

export default function DashboardApprenant() {
  return (
    <>
      <div className="container containerApprenant m-5">
        <div className="row rowAppenant">
          <div className="col-12 colApprenant">
            <img src={userProfile} alt="" className="icon" />
            <span>
              <h6>Cheikh Ahmed Tidiane Gueye</h6>
              <p>19 Dec 2023, 16:05</p>
            </span>
          </div>
          <div className="col-12">
            <img src={livraison} alt=""  className="publication"/>
          </div>
        </div>
      </div>
    </>
  );
}
