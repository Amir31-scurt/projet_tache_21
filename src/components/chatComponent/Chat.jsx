import React from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function Chat() {
  return (
    <div className="chat ">
      <div className="chatInfo p-1">
        <span className="fst-italic text-white">user.name</span>
      </div>
      <Messages />
      <ChatInput />
    </div>
  );
}
