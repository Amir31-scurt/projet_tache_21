import React from "react";
import userProfile from "../assets/images/userProfile.png";
import livraison from "../assets/images/livraison.jpg";

export default function DashboardApprenant() {
  return (
    <>
      <div className="container containerApprenant w-50 m-5">
        <div className="row rowAppenant">
          <div className="col-12 colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <span className="mySpan">
              <h6 className="p-0 m-0">Cheikh Ahmed Tidiane Gueye</h6>
              <p className="p-0 m-O">19 Dec 2023, 16:05</p>
            </span>
          </div>

          <div className="col-12 my-2">
            <img src={livraison} alt="" className="publication" />
          </div>

          <div className="col-12">
            <div class="form-floating my-3">
              <input
                type="file"
                className="form-control textarea"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                // style={{height: ''}}
              ></input>
              <label for="floatingTextarea2">Ajouter un commentaire</label>
            </div>
            {/* <div className="w-100 d-flex jutify-content-end">
              <button type="button" class="btn btn-success mb-3">
                Envoyer
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
