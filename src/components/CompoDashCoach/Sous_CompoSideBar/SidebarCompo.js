import React from 'react';
import { NavLink } from 'react-router-dom';

function SidebarCompo({ title, icon, id, link }) {
  return (
    <NavLink
      to={link}
      className="list-group-item px-2 LienSidBar list-group-item bg-transparent border-0 px-2"
      activeClassName="active-link"
      style={{ textDecoration: 'none' }}
      id={id}
    >
      <span className="fs-5 mx-2 icon">{icon}</span>
      <span className="title">{title}</span>
    </NavLink>
  );
}

export default SidebarCompo;
