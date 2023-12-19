import React from 'react'
import affiche from '../assets/images/affiche.jpg'
import FormConnect from '../components/formConnect'




export default function Connexion() {

   
  return (
    
  <div class="container-fluid contain-connect  ">
    <div class="row d-flex justify-content-center align-items-center ">
          <div class="row g-0 justify-content-arround">
            <div class=" height-img   col-lg-5 d-none d-md-block ">
              <img src={affiche}
                alt="login form" className="img-fluid rounded-6" />
            </div>
            <div class="col-lg-7 height-form d-flex justify-content-center">
            <FormConnect/>
            </div>
          </div>
        
      
    </div>
  </div>
  
  )
}
