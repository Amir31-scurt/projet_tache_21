import React from 'react';
import { MdTask } from 'react-icons/md';
import { PiUsersFourFill } from 'react-icons/pi';

export const ContenuCardDsb = [
  // {
  //   ChiffreCardDsb: '26',
  //   IconeCardDsb: <FaUsers style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />,
  //   TextCardDsb: 'Professeurs',
  //   couleurCarte: 'CouleurA',
  // },
  {
    ChiffreCardDsb: '134',
    IconeCardDsb: <PiUsersFourFill style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />,
    TextCardDsb: 'Etudiants',
    couleurCarte: 'CouleurB',
  },
  {
    ChiffreCardDsb: '32',
    IconeCardDsb: <MdTask style={{ fontSize: '68px', opacity: '1', color: '#fff' }} />,
    TextCardDsb: 'Taches',
    couleurCarte: 'CouleurC',
  },
];

export default function DashboardCompo({ ChiffreCardDsb, IconeCardDsb, TextCardDsb, couleurCarte }) {
  return (
    <div className="WidthCardDsb">
      <div className={`CardDashBoard d-flex justify-content-center align-items-center pb-3 my-3 ${couleurCarte}`}>
        <div className="px-4">
          <div className="d-flex justify-content-between ">
            <div className="me-5 d-flex align-items-center pt-3">
              <p className="fs-1 px-2 fw-bold fst-italic" style={{ color: '#fff' }}>
                {ChiffreCardDsb}
              </p>
            </div>
            <div className="ms-5 mt-3">{IconeCardDsb}</div>
          </div>
          <div className="">
            <p className="fs-4 fw-bold fst-italic" style={{ color: '#fff' }}>
              {TextCardDsb}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
