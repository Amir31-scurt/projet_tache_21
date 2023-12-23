import React from 'react';
import CardLivraison from '../components/CardLivraison';
import DashboardCompo from '../components/programmes/Single_Programmes/DashboardCompo';
import { ContenuCardDsb } from '../components/CompoDashCoach/Sous_CompoSideBar/Utils';

export default function DashboardApprenant() {
  return (
    <div className="d-flex flex-column ms-3 justify-content-center">
      <span
        className="fst-italic fs-3 fw-bold ps-2 pt-3"
        style={{ color: "#5a2a00" }}
      >
        <h1>Dashboard</h1>
      </span>
      <div className="d-flex">
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
