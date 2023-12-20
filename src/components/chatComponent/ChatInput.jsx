import React from "react";

export default function ChatInput() {
  return (
    <div className="chatInput d-flex">
      <input type="text" value="" className="form-control" />
      <div className="send">
        <button className="btn bg-primary">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  );
}
