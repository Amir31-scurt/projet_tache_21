import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import affiche from '../assets/images/affiche.jpg'
export default function Connexion() {
  return (
    
  <div class="container-fluid contain-connect  ">
    <div class="row d-flex justify-content-center align-items-center ">
          <div class="row g-0 justify-content-arround">
            <div class=" height-img  col-lg-5 d-none d-md-block ">
              <img src={affiche}
                alt="login form" className="img-fluid rounded-6" />
            </div>
            <div class="col-lg-7 height-form d-flex justify-content-center">
              <div class="card-body   p-lg-5 text-black">
              <div class="d-flex justtify-content-center   bouton-switch  ">
              <button type="button" class="btn btn-outline-success btn-rounded tir  ">Login</button>
              <button type="button" class="btn btn-outline-success btn-rounded tir">Register</button> 
              </div>
                <form >
                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat recusandae</p>
                  <div class="form-outline mb-4">
                  <label class="form-label" for="form2Example17">Addresse Email</label>
                    <input type="email" id="form2Example17" class="form-control  rounded-3 form-control-lg" placeholder='Email' />
                    
                  </div>

                  <div class="form-outline mb-4">
                  <label class="form-label" for="form2Example27">Mot de Pass</label>
                    <input type="password" id="form2Example27" class="form-control form-control-lg" placeholder='Mot De Pass' />
                  
                  </div>

                  <div class="pt-1 mb-4">
                    <button class="btn btn-outline-success btn-lg btn-block tir" type="button">Login</button>
                  </div>

                  <Link
                      to="/Modal"
                      onClick={handleShowModal}
                      className="text-decoration-none"
                    >
                      <p className="m-0 p-0">Mot de passe oublié?</p>
                    </Link>
                </form>

              </div>
            </div>
          </div>
        
      
    </div>
  </div>
  
  )
}
