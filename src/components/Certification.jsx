// // Certification.jsx
import React from 'react'
import signature from '../assets/images/signature.png'
import codeqr from '../assets/images/codeqr.png'
import gandal from '../assets/images/gandal .png'
import './Certification.css'

function Certification() {
  return (
    <div className="container">
      <div className="row justify-content-center flex-wrap">
        <div className="col-md-6">
          <div class="card  p-2 border-0 shadow-5 ">
            <div class="card-body dash">
              <div className="flex-column justify-content-center m-0">
                <img className="img-fluid reduct" src={gandal} alt="" />
              </div>
              <div className="text-center">
                <h6 class="card-subtitle  fw-bolder fs-4">Oumar Ndongo</h6>
                <p>a terminé avec succes le</p>
                <p class="card-text fw-bolder fs-3">
                  Programme de Développement Web
                </p>
                <p class="card-text">
                  Certification de développeur le 20 decembre 2023
                </p>
                <p class="card-text ">représentant 1 an de formation</p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="">
                  <p class=" text-center  DG">Amadou woury BAH</p>
                  <img className="img-fluid ajout" src={signature} alt="" />
                </div>
                <div className="">
                  <img className="img-fluid ajout" src={codeqr} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certification

