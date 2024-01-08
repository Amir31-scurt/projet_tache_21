import React from 'react';

export default function Card({ title, description, imageUrl, buttonText }) {
  return (
    <div className="program-card2 card bg-light">
      <img src={imageUrl} alt={title} />
      <h3>Coach</h3>
      <p>{description}ijjjoiiuuu</p>
      <button>{buttonText}</button>
    </div>
  );
}
