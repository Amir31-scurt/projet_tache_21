import React from "react";
import pp from "../../assets/images/user.png";

export default function ChatNavbar() {
  return (
    <div className="chatNavbar  bg-primary">
      <div className="user">
        <img src={pp} alt="pp" />
        <span>myName</span>
      </div>
    </div>
  );
}
