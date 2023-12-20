import React, { useState } from "react";
import userProfile from "../assets/images/userProfile.png";
import livraison from "../assets/images/livraison.jpg";

export default function DashboardApprenant() {
  const [nom, setNom] = useState("Cheikh Ahmed Tidiane Gueye");
  const [date, setDate] = useState("19 Dec 2023, 16:05");
  const [days, setDays] = useState("1");
  const [comment, setComment] = useState("Good job (:-)");
  const [role, setRole] = useState("Coach");

  return (
    <>
      <div className="container containerApprenant w-50 my-5">
        <div className="row rowAppenant ">
          <div className="col-md-12 d-flex flex-sm-column colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-2">{nom}</h6>
              <p className=" m-0 ">{date}</p>
            </div>
          </div>

          <div className="col-12 my-2">
            <img src={livraison} alt="" className="publication rounded-2" />
          </div>

          <div className="col-12">
            <div className="row comment border rounded-2 w-100 m-0 my-2">
              <div className="col-12 py-1">
                <p className="">
                  <span className="fw-bolder">Coach Kalika Ba</span>
                  <span className="coach bg-success text-light rounded-2 px-2 mx-3">
                    {role}
                  </span>
                  <span>il y a {days} jour</span>
                </p>
              </div>
              <div className="col-12">
                <p>{comment}</p>
              </div>
            </div>

            <div class="form-floating my-3">
              <input
                className="form-control textarea"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{}}
              ></input>
              <label for="floatingTextarea2">Ajouter un commentaire</label>
              {/* <i class="bi bi-send"></i> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}