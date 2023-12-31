import React, { useContext, useEffect, useState } from 'react';
import { NavBarCompo } from '../components/CompoDashCoach/Sous_CompoNavBar/NavBarCompo';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/CompoDashCoach/Sous_CompoSideBar/SideBar';
import { AuthContext } from '../contexte/AuthContext';
import Card from '../utils/cards_reusable';
import logo from '../assets/images/logo.png';
import { EmailContext } from '../contexte/EmailContexte';

export default function Template() {
  const { currentUser } = useContext(AuthContext);
  const { setEmail } = useContext(EmailContext);
  // const [currentUser, setCurrentUser] = useState(initialUser);
  const location = useLocation();
  const navigate = useNavigate();
  const timelinePath = '/dashboard';
  const isDashboard = location.pathname === timelinePath;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoading(false);
    }
  }, [setEmail]);

  // useEffect(() => {
  //   const initializeData = async () => {
  //     const storedUser = localStorage.getItem('user');
  //     if (storedUser) {
  //       // Parse the stored data and set it to the current user
  //       setCurrentUser(JSON.parse(storedUser));
  //     }
  //     setIsLoading(false);
  //   };
  //   initializeData();
  // }, []);

  // useEffect(() => {
  //   // When the currentUser changes, store it in local storage
  //   localStorage.setItem('user', JSON.stringify(currentUser));
  // }, [currentUser]);

  if (isLoading) {
    return (
      <div className="loadingPageLogo">
        <img src={logo} alt="logo" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />; // Redirect to home page
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
        <div className="bodyContent col d-flex">
          <div className="col">
            <Outlet />
            {/* Outlet Position */}
          </div>
          {isDashboard && (
            <div className="col-3 d-none d-lg-block">
              <Card />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
