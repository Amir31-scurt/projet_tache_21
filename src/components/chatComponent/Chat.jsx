import React from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function Chat() {
  return (
    <div className="chat ">
      <div className="chatInfo bg-dark p-1">
        <span className="text-white">Nom correspondant</span>
      </div>
      <Messages />
      <ChatInput />
    </div>
  );
}
