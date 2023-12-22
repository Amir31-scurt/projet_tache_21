import React from 'react'
// import Card from ''


export default function DashboardCompo({
  ChiffreCardDsb,
  IconeCardDsb,
  TextCardDsb,
  couleurCarte,
}) {
  return (
    <div>
      <div
        className={`CardDashBoard d-flex justify-content-center align-items-center ms-1 my-3 me-4 ${couleurCarte}`}
      >
        <div className="bg-dangr px-4">
          <div className="d-flex justify-content-between ">
            <div className="me-5 d-flex align-items-center pt-3">
              <p className="fs-1 px-2 fw-bold fst-italic" style={{ color: "#5a2a00" }}>
                {ChiffreCardDsb}
              </p>
            </div>
            <div className="ms-5 mt-3">{IconeCardDsb}</div>
          </div>
          <div className="">
            <p className="fs-4 fw-bold fst-italic" style={{ color: "#ee6d09" }}>
              {TextCardDsb}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
