import React from 'react';
// import html from '../assets/images/htmlcss.jpg'
import { Link } from 'react-router-dom';
export default function CompoHtml({ title, url, sousDomaineName, domaineId }) {
  const link = `/etudiant/programme-apprenant/cours/${domaineId}/${sousDomaineName}`;
  return (
    <Link to={link} className="text-decoration-none col">
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
          </div>
        </div>
      </div>
    </Link>
  );
}
