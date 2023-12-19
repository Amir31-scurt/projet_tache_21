import React from 'react'
import { Link } from 'react-router-dom'

function SidebarCompo({title, icon, path}) {
  return (
    <Link
      style={{ textDecoration: "none" }}
      className="list-group-item"
      to={path}
    >
      <i className={icon}></i>
      <span className="fs-5">{title}</span>
    </Link>
  )
}

export default SidebarCompo