import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatHeader from "./ChatHeader";
import Chat from "./Chat";
import "../../assets/css/chat.css";

export default function ChatHome() {
  const [openChat, setOpenChat] = useState(false);
  return (
    <div className="chatHomeContainer text-white">
      {/* {openChat && ( */}
      <div className={`chatHome rounded ${openChat ? "" : "chatHomeDisplay"}`}>
        <div className="chatContainer">
          <ChatHeader />
          <Chat />
        </div>
      </div>
      {/* )} */}
      <button className="btn mt-2 rounded-circle" id="btn-toggle">
        {!openChat ? (
          <i
            className="bi bi-chat-fill fs-4"
            onClick={() => setOpenChat(true)}
          ></i>
        ) : (
          <i className="bi bi-x-lg fs-4" onClick={() => setOpenChat(false)}></i>
        )}
      </button>
    </div>
  );
}
