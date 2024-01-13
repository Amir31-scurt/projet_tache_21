import React, { useContext, useEffect, useRef, useState } from "react";
import pp from "../../assets/images/user.png";
// import messageTexto from "../../assets/images/affiche.jpg";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";

export default function Message({ message }) {
  const { currentUser } = useContext(ChatAuthCtx);

  const mess = useRef();

  const [jourSemaine, setJourSemaine] = useState("");
  const [date, setDate] = useState("");
  const [mois, setMois] = useState("");
  const [heures, setHeures] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    // Faire scroller vers le bas à chaq nouveau message
    mess.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={mess}
      className={`message my-3 d-flex ${
        message ? message?.senderId !== currentUser?.uid && "owner" : ""
      }`}
    >
      <div className="messageInfo d-flex flex-column">
        <img src={pp} alt="" />
      </div>
      <div className="messageContent">
        <span className="text-dark">{message?.jour}</span>
        <p className="bg-primary text-white text-wrap px-2 pt-2 pb-3">
          {message?.text}
          <span className="">{message?.heures}</span>
        </p>
        {/* <img src={messageTexto} alt="" /> */}
      </div>
    </div>
  );
}
