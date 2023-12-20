import React from 'react'
// import { Link } from 'react-router-dom'

function SidebarCompo({title, icon, id}) {
  return (
    <a
        href="#link"
      style={{ textDecoration: "none" }}
      className="list-group-item bg-transparent border-0 px-2"
      id={id}
    >
      <span className="fs-5 mx-2 icon">{icon}</span>
      <span className="title">{title}</span>
    </a>
  )
}

export default SidebarCompo