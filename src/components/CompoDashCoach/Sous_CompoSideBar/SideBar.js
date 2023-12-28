import React, { useContext } from 'react';
import { EmailContext } from '../../../contexte/EmailContexte'; // Adjust the import path as needed
import { getSidebarMenu } from './getSidebarMenu'; // Ensure this is where getSidebarMenu is defined
import SidebarCompo from './SidebarCompo';

function SideBar() {
  const { email } = useContext(EmailContext);
  const menuItems = getSidebarMenu(email); // Generate menu based on email

  return (
    <div className="sidebar col-lg-2">
      <div className="py-3" id="contentSidebar">
        <div className="linkSidebar">
          {menuItems.map((elem, index) => (
            <SidebarCompo {...elem} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
