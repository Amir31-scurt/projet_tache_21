import React from 'react'

// import bootstrap from '../assets/';
// import trois from '../assets/images/3.png';
import CompoHtml from "./compoHtml";
        

export default function Programme() {
  return (
    <div className='bg-cours'>
    <div className='container ' >
      <h2 className='text-start'>Mon Programme</h2>
      <div className='row'>
        <div className='col-md-3'>
         <CompoHtml/>
        </div>
        <div className='col-md-3'>
         <CompoHtml/>
        </div>
        <div className='col-md-3'>
         <CompoHtml/>
        </div>
        <div className='col-md-3'>
         <CompoHtml/>
        </div>
      
    </div>
    </div>
    </div>
  )
}
