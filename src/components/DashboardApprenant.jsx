import React, { useEffect } from 'react';
import CardLivraison from './CardLivraison';
import DashboardCompo from './programmes/Single_Programmes/DashboardCompo';
import { ContenuCardDsb , Users } from './CompoDashCoach/Sous_CompoSideBar/Utils';

export default function DashboardApprenant() {
  return (
    <div className="d-flex flex-column ms-3 justify-content-center">
      <h1
        className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3" 
      >
        Dashboard
      </h1>
      {/*========= Les cartes du dashboard Debut =========*/}
      <div className="d-flex ContaCardDsb justify-content-start">
        {ContenuCardDsb.map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
    </div>
  );
}
