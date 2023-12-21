import React from 'react';

export default function Card({ title, description, imageUrl, buttonText }) {
  return (
    <div className="program-card card bg-light">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button>{buttonText}</button>
    </div>
  );
}
