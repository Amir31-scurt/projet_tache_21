import React from "react";

export default function ChatInput() {
  return (
    <div className="chatInput d-flex p-1">
      <input type="text" value="" className="form-control rounded-pill me-1" />
      <div className="send">
        <button className="btn rounded-circle">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}
