import React from 'react';
// import html from '../assets/images/htmlcss.jpg'
import { Link } from 'react-router-dom';
export default function CompoHtml({ title, url, sousDomaineName, domaineId }) {
  const link = `/etudiant/cours/${domaineId}/${sousDomaineName}`;
  return (
    <Link to={link} className="text-decoration-none">
      <div className="">
        <div className="card rounded-4 shadow">
          <div className="program-img">
            <img
              src={url}
              className="card-img-top img-fluid rounded-4 w-100"
              alt="img"
            />
          </div>
          <div className="card-body border-top">
            <h4>{title}</h4>
            <div
              className="progress"
              role="progressbar"
              aria-label="Example 10px high"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="progress-bar text-warning"
                style={{ width: '25%', background: '#3084b5' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

     
    </Link>
  );
}
