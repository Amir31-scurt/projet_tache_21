import React from "react";
import ChatNavbar from "./ChatNavbar";
import Chats from "./Chats";
import Search from "./Search";

export default function ChatHeader() {
  return (
    <div className="chatHeader">
      {/* <ChatNavbar /> */}
      <Search />
      <Chats />
    </div>
  );
}
