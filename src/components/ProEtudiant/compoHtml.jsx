import React from 'react';
// import html from '../assets/images/htmlcss.jpg'
import { Link } from 'react-router-dom';
export default function CompoHtml({
  title,
  url,
  sousDomaineName,
  domaineId,
  progress,
}) {
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
          <div className="card-body border-top" style={{ height: '130px' }}>
            <h5>{title}</h5>
          </div>
          {/* <div className="card-footer">
            <p>Progress: {progress}%</p>
          </div> */}
        </div>
      </div>
    </Link>
  );
}
