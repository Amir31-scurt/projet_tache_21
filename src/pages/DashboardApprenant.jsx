import React from 'react';
import CardLivraison from '../components/CardLivraison';
import DashboardCompo from '../components/programmes/Single_Programmes/DashboardCompo';
import { ContenuCardDsb } from '../components/CompoDashCoach/Sous_CompoSideBar/Utils';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';

export default function DashboardApprenant() {
  return (
    <div className=" ps-0 ps-md-3">
      <h1
        className="fst-italic fs-3 fw-bold ps-2 pt-3"
        style={{ color: '#5a2a00' }}
      >
        Dashboard
      </h1>
      {/*========= Les cartes du dashboard Debut =========*/}
      <div className="d-flex ContaCardDsb justify-content-between">
        {ContenuCardDsb.map((elem, index) => (
          <DashboardCompo {...elem} key={index} />
        ))}
      </div>
      {/*========= Les cartes du dashboard Fin =========*/}

      {/*========= La barred e recherche Debut =========*/}
      <div className=" d-flex justify-content-end mt-2">
        <InputGroup style={{ width: '410px', border: '1px solid #e16d09' }}>
          <Input placeholder="Rechercher une livraison" />
          <InputGroup.Button style={{ background: '#5a2a00' }}>
            <SearchIcon style={{ color: '#e16d09', fontSize: '30px' }} />
          </InputGroup.Button>
        </InputGroup>
      </div>

      {/*========= La barred e recherche Fin =========*/}

      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
      <CardLivraison />
    </div>
  );
}
