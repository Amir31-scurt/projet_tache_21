import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import affiche from '../assets/images/affiche.jpg'
export default function Connexion() {
  return (
    <div className='container'>Connexion
      <div className='row d-flex '>
        <div className='col-md-6 '>
          <div><img src={affiche} alt="" className='img-fluid' /></div>
        </div>
      <div className='col-md-6 justify-content-center'>
      
    <form className='justify-content-center'>
    <div className=''>les deux bouttons</div>
    <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
    </form>
      </div>
      </div>
    </div>
  )
}
