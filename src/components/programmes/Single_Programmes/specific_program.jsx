import React, { useEffect, useState } from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS
import { SelectPicker } from 'rsuite';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';

const SpecificPro = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const docRef = doc(db, 'domaines', courseId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          console.log(docSnapshot.data()); // Add this line to log the fetched data
          setCourseData(docSnapshot.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching course data: ', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Ensure that sousDomainesData is correctly formatted for SelectPicker
  const sousDomainesData =
    courseData && courseData.sousDomaines
      ? Object.entries(courseData.sousDomaines).map(([key, value]) => ({
          label: key,
          value: key,
          role: courseData.domaine, // Assuming 'value' here represents the 'role'
        }))
      : [];

  return (
    <div className="main-container">
      <section className="header-section d-flex align-items-center flex-column flex-lg-row gap-4 gap-lg-0">
        <div className="">
          <p>
            Le développement web est un domaine dynamique et en constante
            évolution, offrant de nombreuses opportunités de carrière, une
            flexibilité professionnelle, et la satisfaction de créer des
            produits utilisés par des millions de personnes.
          </p>
          <hr />
          <h5 className="mb-3 text-center">Ajouter des cours</h5>
          <div className="d-flex flex-column flex-wrap gap-2 justify-content-center align-items-center col-lg-6 mx-auto mx-lg-0">
            <>
              <SelectPicker
                data={sousDomainesData}
                groupBy="role"
                style={{ width: 224 }}
                className="w-100"
              />
            </>
            <input
              type="text"
              name="coursAjout"
              id="coursAjout"
              placeholder="Le lien des cours"
              className="w-100 rounded p-1 border-secondary border-opacity-25 border-1"
            />
            <button className="learn-more-btn rounded-5">Ajouter</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecificPro;
