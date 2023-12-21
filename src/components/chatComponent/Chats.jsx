import React from "react";
import pp from "../../assets/images/user.png";

export default function Chats() {
  return (
    <div className="chats d-flex p-2">
      <div className="userChat bg-secondary">
        <img src={pp} alt="" />
        <div className="userChatInfo">
          {/* <span>His Namne</span>
          <p>last sms</p> */}
        </div>
      </div>
      <div className="userChat bg-secondary">
        <img src={pp} alt="" />
        <div className="userChatInfo">
          {/* <span>His </span>
          <p>last </p> */}
        </div>
      </div>
    </div>
  );
}
