import React, { useContext } from 'react';
import { NavBarCompo } from '../components/CompoDashCoach/Sous_CompoNavBar/NavBarCompo';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import SideBar from '../components/CompoDashCoach/Sous_CompoSideBar/SideBar';
import { AuthContext } from '../contexte/AuthContext';
import Card from '../outils/cards_reusable';

export default function Template() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const timelinePath = '/dashboard';
  const isDashboard = location.pathname === timelinePath;
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="BigContainer">
      <div className="NavSide fixed-top">
        <NavBarCompo />
      </div>
      <div className="Side_Content">
        <div className="SideSection">
          <SideBar />
        </div>
        <div className="bodyContent d-flex">
          <div className="col">
            <Outlet />
          </div>
          <div className="col">
            {isDashboard && (
              <div className="">
                <Card />
              </div>
            )}
          </div>
          {/* Outlet Position */}
        </div>
      </div>
    </div>
  );
}
