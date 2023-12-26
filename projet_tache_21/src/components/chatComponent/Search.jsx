import React from "react";
import pp from "../../assets/images/user.png";

export default function Search() {
  return (
    <div className="search">
      <div className="searchForm ">
        <div
          className="input-group d-flex align-items-center p-2"
          id="navbar-input-container"
        >
          <i className="bi bi-search my-auto "></i>
          <input
            type="text"
            className="form-control text-white border-0"
            placeholder="Search"
            autoFocus
          />
          {/* <i className="bi bi-x-lg  my-auto fs-4" id="closeSearch"></i> */}
        </div>
      </div>
      <div className="d-flex p-2">
        <div className="userChat">
          <img src={pp} alt="" />
          <div className="userChatInfo">{/* <span>His Name</span> */}</div>
        </div>
      </div>
    </div>
  );
}
