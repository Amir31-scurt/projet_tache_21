import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

// Define a reusable ProgramCard component
const ProgramCard = ({ title, description, buttonText, courseId, url }) => {
  return (
    <div className="program-card1 bg-white rounded-4 shadow-4">
      <h5>{title}</h5>
      <hr /> 
      <img src={url} alt='img' className='w-100 img-fluid' style={{height: "40%"}} />
      <div className="mb-3">
        {description &&
          description.map((desc, index) => (
            <p className="m-0 p-0" key={index}>
              {desc}
            </p>
          ))}
      </div>
      <button className='rounded-5'>
        <Link
          to={`/dashboard/programme/cours/${courseId}`}
          className="text-light text-decoration-none"
        >
          {buttonText}
        </Link>
      </button>
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
              description={program.description}
              buttonText={program.buttonText}
              url={program.url}
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
