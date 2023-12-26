import React from 'react';
import Suivi from './suivi-program'; // Ensure the CSS file is imported
import { FaPaintBrush } from 'react-icons/fa';
import { RiCodeView } from 'react-icons/ri';
import { FcElectroDevices } from 'react-icons/fc';
import { SiGeeksforgeeks } from 'react-icons/si';
import { MdSettingsSystemDaydream } from 'react-icons/md';
import { MdOutlineSystemSecurityUpdateGood } from 'react-icons/md';

// Mock data - replace with real icons from your icon library (e.g., Font Awesome)
const categoriesData = [
  {
    title: 'Front-end',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <RiCodeView />,
  },
  {
    title: 'Back-end',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <FcElectroDevices />,
  },
  {
    title: 'Full stack',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <SiGeeksforgeeks />,
  },
  {
    title: 'Logiciels Systèmes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <MdSettingsSystemDaydream />,
  },
  {
    title: 'Développement Mobile',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    icon: <MdOutlineSystemSecurityUpdateGood />,
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
