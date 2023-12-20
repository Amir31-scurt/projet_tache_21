import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import ChatHeader from "./ChatHeader";
import Chat from "./Chat";

export default function ChatHome() {
  return (
    <div className="chatHome">
      <div className="chatContainer">
        <ChatHeader />
        <Chat />
      </div>
    </div>
  );
}
