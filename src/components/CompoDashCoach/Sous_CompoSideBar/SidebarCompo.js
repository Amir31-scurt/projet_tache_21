import React from 'react';
import { Link } from 'react-router-dom';

function SidebarCompo({ title, icon, id, link }) {
  return (
    <Link
      to={link}
      className="list-group-item px-2 LienSidBar list-group-item bg-transparent border-0 px-2"
      style={{ textDecoration: 'none' }}
      id={id}
    >
      <span className="fs-5 mx-2 icon">{icon}</span>
      <span className="title">{title}</span>
    </Link>
  );
}

export default SidebarCompo;
