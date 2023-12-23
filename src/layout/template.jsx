import React from 'react';
import { NavBarCompo } from '../components/CompoDashCoach/Sous_CompoNavBar/NavBarCompo';
import SideBar from '../components/CompoDashCoach/Sous_CompoSideBar/SideBar';
import CardLivraison from '../components/CompoDashCoach/CardLivraison';
import ContentCardLivraison from '../components/ContentCardLivraison';

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
          <div className='container p-0 m-0'>
              <ContentCardLivraison />
          </div>
          {/* Outlet Position */}
        </div>
      </div>
    </div>
  );
}
