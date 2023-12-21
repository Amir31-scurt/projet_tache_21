import React, { useState } from "react";
import userProfile from "../assets/images/userProfile.png";
import livraison from "../assets/images/livraison.jpg";
import envoi from "../assets/images/envoi.png";
import commenter from "../assets/images/commenter.png";

// import { Button } from "primereact/button";
import {Dialog} from 'primereact/dialog';

export default function DashboardApprenant() {

  const [apprenant, setApprenat] = useState("Cheikh Ahmed Tidiane Gueye");
  const [coach, setCoach] = useState('Kalika Ba')
  const [date, setDate] = useState("19 Dec 2023, 16:05");
  const [days, setDays] = useState("1");
  const [comment, setComment] = useState("Good job (:-)");
  const [role, setRole] = useState("Coach");
  const [visible, setVisible] = useState(false);

  function handleSend() {
    console.log("Cliqué sur l'image send");
    alert("message envoyé");
  }

  return (
    <>
      <div className="container containerApprenant w-50 my-5">
        <div className="row rowAppenant ">
          <div className="col-md-12 d-flex flex-sm-column colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-2 mainColor">{apprenant}</h6>
              <p className="m-0 mainColor">{date}</p>
            </div>
          </div>

          <div className="col-12 my-2 ">
            <img src={livraison} alt="" className="publication rounded-2" />
          </div>
          <div className="row comment border rounded-2 m-0 my-2 boxshadow">
            <div className="col-12 py-1">
              <p className=" d-flex">
                <span className="fw-bolder">{coach}</span>
                <span className="text-light bg-warning rounded-2 px-2 mx-3 pb-0 mainBackgrounColor">
                  {role}
                </span>
                <span>il y a {days} jour</span>
              </p>
            </div>
            <div className="col-12">
              <p>{comment}</p>
            </div>
          </div>

          <div className="card flex justify-content-center">
            <Dialog
              header="Commentaires"
              visible={visible}
              maximizable
              style={{ width: "50vw" }}
              onHide={() => setVisible(false)}
            >
              <div className="row comment border rounded-2 m-0 my-2 boxshadow">
                <div className="col-12 py-1">
                  <p className=" d-flex">
                    <span className="fw-bolder">{coach}</span>
                    <span className="text-light bg-warning rounded-2 px-2 mx-3 pb-0 mainBackgrounColor">
                      {role}
                    </span>
                    <span>il y a {days} jour</span>
                  </p>
                </div>
                <div className="col-12">
                  <p>{comment}</p>
                </div>
              </div>
            </Dialog>
          </div>

          <div className="col-12 py-1 ">
            <div
              className="comment d-flex align-items-center"
              onClick={() => setVisible(true)}
            >
              <img
                src={commenter}
                alt=""
                className=""
                style={{ width: "30px", height: "30px" }}
              />
              <p className="px-2 m-0 sizeHover" style={{ fontSize: "12px" }}>
                Plus de commentaires
              </p>
            </div>

            <div className="form-floating my-3 rounded-2 boxshadow">
              <input
                className="form-control textarea"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{}}
              ></input>
              <label htmlFor="floatingTextarea2">Ajouter un commentaire</label>
              <span className="send" onClick={handleSend}>
                <img
                  src={envoi}
                  alt="send"
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}