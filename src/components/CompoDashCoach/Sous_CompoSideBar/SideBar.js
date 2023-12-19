import React from 'react';
import { menuSidebar } from './Utils';
import SidebarCompo from './SidebarCompo';


function SideBar() {
  return (
    <div className="vh-100 sidebar p-2">
      <div className="m-2" id="">
        <span className="brand-name fs-1 fw-bold mx-2">Menu</span>
      </div>
      <div className="list-group list-group-flush" id='linkSidebar'>
        {menuSidebar.map((elem, index) => (
          <SidebarCompo {...elem} key={index} />
        ))}
      </div>
    </div>
  )
}

export default SideBar