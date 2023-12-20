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
    <div className="chatHomeContainer">
      {openChat && (
        <div className="chatHome border">
          <div className="chatContainer">
            <ChatHeader />
            <Chat />
          </div>
        </div>
      )}
      <button className="btn mt-3 rounded-circle bg-primary" id="btn-toggle">
        {!openChat ? (
          <i
            className="bi bi-chat-fill fs-3"
            onClick={() => setOpenChat(true)}
          ></i>
        ) : (
          <i className="bi bi-x-lg fs-3" onClick={() => setOpenChat(false)}></i>
        )}
      </button>
    </div>
  );
}
