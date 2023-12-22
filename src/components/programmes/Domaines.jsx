import React from 'react';
import Suivi from './suivi-program'; // Ensure the CSS file is imported
import { FaPaintBrush } from 'react-icons/fa';

// Mock data - replace with real icons from your icon library (e.g., Font Awesome)
const categoriesData = [
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  {
    title: 'Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FaPaintBrush />,
  },
  // ... other categories
];

const Domaines = () => {
  return (
    <div className="d-flex justify-content-center flex-wrap">
      {categoriesData.map((category, index) => (
        <Suivi key={index} {...category} />
      ))}
    </div>
  );
};

export default Domaines;
