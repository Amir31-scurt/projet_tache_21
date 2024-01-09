import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

// Define a reusable ProgramCard component
const ProgramCard = ({ title, description, url, buttonText, courseId }) => {
  const cardStyles = `
.program-card1 {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Ensure the card is a stacking context for absolute positioning */
  transform: translateZ(0);
  transition: box-shadow 0.3s;
}

.program-card1:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.program-card1::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3); /* Dark overlay */
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1; /* Below the content and button */
}

.program-card1:hover::before {
  opacity: 1;
}

.program-card1-content {
  transition: filter 0.3s;
}

.program-card1:hover .program-card1-content {
  filter: blur(5px);
}

.program-card1 img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.program-card1 h5, .program-card1 hr, .program-card1 p {
  position: relative;
  z-index: 2; /* Above the overlay */
}

.program-card1 hr {
  margin: 0;
}

.start-button {
  position: absolute;
  background-color: #3084b5;
  color: white;
  text-align: center;
  padding: 12px 20px;
  border: none;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%) translateY(100%);
  opacity: 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s, opacity 0.2s;
  z-index: 10; /* Ensure the button is above the overlay and content */
}

.program-card1:hover .start-button {
  transform: translate(-50%, 50%) translateY(0);
  opacity: 1;
}

`;
  return (
    <div className="program-card1 shadow-5 rounded-5">
      <style>{cardStyles}</style>
      <button className="start-button rounded-5">
        <Link
          to={`/coach/programme/cours/${courseId}`}
          className="text-light text-decoration-none d-block w-100 h-100"
        >
          {buttonText}
        </Link>
      </button>
      <div className="program-card1-content">
        <button className="titleHolder mt-2 me-1   rounded-5">{title}</button>
        <img src={url} alt={title} />
        <hr />
        <div className="py-3 px-3 bodyCoursCards">
          {description &&
            description.map((desc, index) => (
              <li className="pb-2 text-light" key={index}>
                {desc}
              </li>
            ))}
        </div>
      </div>
    </div>
  );
};

// Main component that uses ProgramCard to display a list of programs
const ProgramList = () => {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const domainesSnapshot = await getDocs(collection(db, 'domaines'));
        const allProgrammes = domainesSnapshot.docs
          .filter((doc) => !doc.data().archived) // Filter out documents where 'archived' is true
          .map((doc) => {
            const data = doc.data();
            return {
              title: data.domaine,
              url: data.url,
              description: formatDescription(data.sousDomaines),
              buttonText: data.buttonText || 'Les cours',
              url: data.url,
              id: doc.id,
            };
          });

        setProgrammes(allProgrammes);
      } catch (error) {
        console.error('Error fetching programmes: ', error);
      }
    };

    fetchProgrammes();
  }, []);

  return (
    <div className="containerProgramme d-flex flex-column justify-content-center align-items-center">
      <div className="contain1 py-5">
        <h2 className="mb-5 text-center">Programmes</h2>
        <div className="d-flex flex-wrap justify-content-center">
          {programmes.map((program, index) => (
            <ProgramCard
              key={index}
              title={program.title}
              url={program.url}
              description={program.description}
              buttonText={program.buttonText}
              courseId={program.id} // Assuming each program has a unique identifier
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to format the description from a map
function formatDescription(sousDomaines) {
  if (!sousDomaines || typeof sousDomaines !== 'object') {
    return [];
  }

  return Object.entries(sousDomaines).map(([key]) => {
    // Assuming each value in the map is a string
    return `${key}`;
  });
}

export default ProgramList;
