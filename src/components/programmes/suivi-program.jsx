import React from 'react';

const Suivi = ({ title, description, icon }) => {
  return (
    <div className="category-card">
      <div className="category-icon">{icon}</div>
      <h3 className="category-title">{title}</h3>
      <p className="category-description">{description}</p>
    </div>
  );
};

export default Suivi;
