import React, { useContext } from "react";
import pp from "../../assets/images/user.png";
import messageTexto from "../../assets/images/affiche.jpg";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";

export default function Message({ message }) {
  const { currentUser } = useContext(ChatAuthCtx);
  return (
    <div
      className={`message my-2 d-flex ${
        message ? message?.senderId !== currentUser?.uid && "owner" : ""
      }`}
    >
      <div className="messageInfo d-flex flex-column">
        <img src={pp} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p className="bg-primary text-white p-2"> {message?.text}</p>
        {/* <img src={messageTexto} alt="" /> */}
      </div>
    </div>
  );
}
