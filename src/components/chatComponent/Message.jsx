import React from "react";
import pp from "../../assets/images/user.png";
import messageTexto from "../../assets/images/affiche.jpg";

export default function Message() {
  return (
    <div className="message my-2 d-flex">
      <div className="messageInfo d-flex flex-column">
        <img src={pp} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p className="bg-primary text-white p-2"> My texto</p>
        <img src={messageTexto} alt="" />
      </div>
    </div>
  );
}
