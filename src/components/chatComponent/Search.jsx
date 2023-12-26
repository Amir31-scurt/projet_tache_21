import React from "react";
import pp from "../../assets/images/user.png";

export default function Search() {
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className="form-control w-75 border-0"
          placeholder="Search"
        />
      </div>
      <div className="d-flex">
        <div className="userChat">
          <img src={pp} alt="" />
          <div className="userChatInfo">{/* <span>His Name</span> */}</div>
        </div>
      </div>
    </div>
  );
}
