import React from 'react';
import { menuSidebar } from './Utils';
import SidebarCompo from './SidebarCompo';


function SideBar() {
  return (
    <div className="sidebar col-md-2">
        <div className="py-3" id="contentSidebar">
            <div className="linkSidebar">
                {menuSidebar.map((elem, index) => (
                    <SidebarCompo {...elem} key={index} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default SideBar