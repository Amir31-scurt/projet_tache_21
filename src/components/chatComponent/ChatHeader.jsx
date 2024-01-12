import React, { useContext, useState } from "react";
import Chats from "./Chats";
import Search from "./Search";
import { AuthContext } from "../../contexte/AuthContext";

export default function ChatHeader() {
  const [openSearch, setOpenSearch] = useState(false);

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="chatHeader position-relative">
      {/* <ChatNavbar /> */}
      <div className="d-flex justify-content-between chatHeaderBtnContainer text-white p-1">
        <span className="ms-2">{currentUser && currentUser.displayName}</span>
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
