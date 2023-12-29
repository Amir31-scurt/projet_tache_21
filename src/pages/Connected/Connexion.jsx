import React, { useState } from 'react';
// import affiche from "../assets/images/affiche.jpg";
import LogoTech from '../../assets/images/logo2.png';
import FormConnect from '../Connected/formConnect';

export default function Connexion() {
  const state = 'true';
  const [connected, setConnected] = useState(state);
  return (
    <div class="container-fluid contain-connect  ">
      <div class="row d-flex justify-content-center align-items-center ">
        <div class="row g-0">
          <div class="height-img d-none d-lg-block col-0 col-lg-6">
            {/* <img
              src={affiche}
              alt="login form"
              className="img-fluid rounded-6"
            /> */}
          </div>
          <div className="height-form  col">
            <div className="card-body  p-lg-5 text-black">
              <div
                className="d-flex flex-column justify-content-center align-items-center border border-light  rounded-pill "
              >
             <div className='imagel d-flex  justify-content-center align-items-center'>
              <img src={LogoTech} className='img-fluid' alt="" />
              <h3 className='' style={{color:'#3084b5'}}>Gandal</h3>
            </div>
              <h2>Connectez-vous</h2>
              </div>
              {  <FormConnect /> }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
