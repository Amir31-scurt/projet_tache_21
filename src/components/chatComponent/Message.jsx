import React, { useContext, useEffect, useRef } from "react";
import pp from "../../assets/images/user.png";
// import messageTexto from "../../assets/images/affiche.jpg";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";

export default function Message({ message }) {
  const { currentUser } = useContext(ChatAuthCtx);

  const mess = useRef();

  useEffect(() => {
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
        <span className="text-dark">just now </span>
        <p className="bg-primary text-white text-wrap p-2"> {message?.text}</p>
        {/* <img src={messageTexto} alt="" /> */}
      </div>
    </div>
  );
}
