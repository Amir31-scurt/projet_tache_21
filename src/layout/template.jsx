import React from 'react';
import { NavBarCompo } from '../components/CompoDashCoach/Sous_CompoNavBar/NavBarCompo';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/CompoDashCoach/Sous_CompoSideBar/SideBar';

export default function Template() {
  return (
    <div className="BigContainer">
      <div className="NavSide fixed-top">
        <NavBarCompo />
      </div>
      <div className="Side_Content">
        <div className="SideSection">
          <SideBar />
        </div>
        <div className="bodyContent">
          <Outlet />
          {/* Outlet Position */}
        </div>
      </div>
    </div>
  );
}
