import React from 'react'
// import html from '../assets/images/htmlcss.jpg'
import { Link } from 'react-router-dom' 
export default function CompoHtml() {
  return (
    <Link to ='/dashboard/dashboardapprenant/programme/cours'className='text-decoration-none'  >
    <div className=''>
         <div className="card rounded-4 shadow">
            <div className='program-img'>
          <img src='' className="card-img-top img-fluid rounded-4" alt="Sunset Over the Sea"/>
            </div>
            <div className="card-body border-top">
            <h4>Html/Css/Bootstrap</h4>
            <div className="progress" role="progressbar" aria-label="Example 10px high" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" >
          <div class="progress-bar text-warning" style={{width: '25%',background:'#3084b5'}}></div> 
            </div>
          </div>  
        </div>
      </div>
      </Link>
  )
}
