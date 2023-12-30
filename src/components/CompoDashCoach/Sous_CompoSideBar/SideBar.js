import React from 'react';
import { GetSidebarMenu } from './getSidebarMenu';

function SideBar() {
  return (
    <div className="sidebar col-lg-2">
      <div className="py-3" id="contentSidebar">
        <div className="linkSidebar">
          <GetSidebarMenu />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
