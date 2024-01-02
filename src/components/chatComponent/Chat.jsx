import React, { useContext } from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChatContext } from "../../contexte/ChatContext";

export default function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat ">
      <div className="chatInfo p-1">
        <div className="justify-content-between text-white">
          <i className="bi bi-chat ms-2 me-3"></i>
          <span className="fst-italic">{data.user?.displayName} </span>
        </div>
      </div>
      <Messages />
      <ChatInput />
    </div>
  );
}
