import React from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function Chat() {
  return (
    <div className="chat ">
      <div className="chatInfo p-1">
        <span className="">Nom de notre correspondant</span>
      </div>
      <Messages />
      <ChatInput />
    </div>
  );
}
