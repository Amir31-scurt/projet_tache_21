import React, { useState } from "react";
import ChatNavbar from "./ChatNavbar";
import Chats from "./Chats";
import Search from "./Search";

export default function ChatHeader() {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div className="chatHeader">
      {/* <ChatNavbar /> */}
      <div className="text-end chatHeaderBtnContainer text-white p-1">
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
