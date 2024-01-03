import React, { useEffect, useState } from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS
import { SelectPicker } from 'rsuite';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
import { ToastContainer, toast } from 'react-toastify';

const SpecificPro = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [newCourseLink, setNewCourseLink] = useState('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState(null);

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

  // Ajouter des cours
  const handleAddCourse = async () => {
    if (!newCourseLink || !selectedSousDomaine) {
      toast.error('Pas de lien ou de sous domaines sélectionnés', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    // Ensure sousDomaines is an object and contains the selected sousDomaine
    const currentSousDomaines =
      courseData.sousDomaines && typeof courseData.sousDomaines === 'object'
        ? courseData.sousDomaines
        : {};

    if (!currentSousDomaines[selectedSousDomaine]) {
      // Handle the case where the selected sousDomaine does not exist
      toast.error("Le sous domaine sélectionné n'existe pas", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    // Update the cours array inside the selected sousDomaine
    const updatedCours = currentSousDomaines[selectedSousDomaine].cours
      ? [...currentSousDomaines[selectedSousDomaine].cours, newCourseLink]
      : [newCourseLink];

    const updatedSousDomaines = {
      ...currentSousDomaines,
      [selectedSousDomaine]: {
        ...currentSousDomaines[selectedSousDomaine],
        cours: updatedCours,
      },
    };

    try {
      await updateDoc(doc(db, 'domaines', courseId), {
        sousDomaines: updatedSousDomaines,
      });

      setCourseData({ ...courseData, sousDomaines: updatedSousDomaines });
      toast.success('Cours ajoutés avec succès', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setNewCourseLink(''); // Clear the input field
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  // Lien des cours dans une cartes
  const getCoursLinks = () => {
    if (!selectedSousDomaine || !courseData.sousDomaines) {
      return [];
    }

    const selectedDomaine = courseData.sousDomaines[selectedSousDomaine];
    return selectedDomaine && selectedDomaine.cours
      ? selectedDomaine.cours
      : [];
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    return null;
  };

  return (
    <div className="main-container">
      <section className="header-section d-flex align-items-center flex-column flex-lg-row gap-4 gap-lg-0">
        <h3 className="text-center">Les sous domaines et cours</h3>
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
                onChange={(value) => setSelectedSousDomaine(value)}
              />
            </>
            <input
              type="text"
              name="coursAjout"
              id="coursAjout"
              placeholder="Le lien des cours"
              className="w-100 rounded p-1 border-secondary border-opacity-25 border-1"
              value={newCourseLink}
              onChange={(e) => setNewCourseLink(e.target.value)}
            />
            <button className="learn-more-btn" onClick={handleAddCourse}>
              Ajouter
            </button>
          </div>
        </div>
      </section>
      <section className="cours-section">
        <h3 className="text-center my-5">Cours Links</h3>
        <div className="d-flex justify-content-center flex-wrap">
          {getCoursLinks().map((link, index) => {
            const videoId = getYouTubeVideoId(link);
            const isYouTubeLink = videoId !== null;
            const embedUrl = isYouTubeLink
              ? `https://www.youtube.com/embed/${videoId}`
              : null;

            return (
              <div key={index} className="card mx-2 my-2">
                <div className="card-body">
                  {isYouTubeLink && (
                    <iframe
                      width="1050"
                      height="680"
                      src={embedUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                  {!isYouTubeLink && (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default SpecificPro;
