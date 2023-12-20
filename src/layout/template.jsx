import React from 'react';
import ProgramList from '../components/programmes/programmes';
import SpecificPro from '../components/programmes/Single_Programmes/specific_program';
import { Routes, Route } from 'react-router-dom';
import { NavBarCompo } from '../components/CompoDashCoach/Sous_CompoNavBar/NavBarCompo';
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
          <div className="w-100">
            <Routes>
              <Route path="/" element={<ProgramList />} />
              <Route path="/specific-cour" element={<SpecificPro />} />
            </Routes>
          </div>
          {/* Outlet Position */}
        </div>
      </div>
    </div>
  );
}
