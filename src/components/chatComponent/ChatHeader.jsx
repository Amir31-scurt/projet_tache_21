import React, { useContext, useState } from "react";
import ChatNavbar from "./ChatNavbar";
import Chats from "./Chats";
import Search from "./Search";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";

export default function ChatHeader() {
  const [openSearch, setOpenSearch] = useState(false);

  const { currentUser } = useContext(ChatAuthCtx);
  console.log(currentUser);

  return (
    <div className="chatHeader">
      {/* <ChatNavbar /> */}
      <div className="d-flex justify-content-between chatHeaderBtnContainer text-white p-1">
        <span>{currentUser && currentUser.displayName}</span>
        {openSearch ? (
          <i
            className="bi bi-x-lg my-auto me-3"
            id="closeSearch"
            onClick={() => setOpenSearch(false)}
          ></i>
        ) : (
          <i
            className="bi bi-search my-auto me-3"
            id="openSearch"
            onClick={() => setOpenSearch(true)}
          ></i>
        )}
      </div>
      {openSearch && <Search />}

      <Chats />
    </div>
  );
}
