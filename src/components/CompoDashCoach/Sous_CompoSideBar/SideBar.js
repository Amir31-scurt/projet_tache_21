import React from 'react';
import { GetSidebarMenu } from './getSidebarMenu';

function SideBar() {
  return (
    <div className="sidebar col-lg-2">
      <div className="py-3" id="contentSidebar">
        <GetSidebarMenu />
      </div>
    </div>
  );
}

export default SideBar;
