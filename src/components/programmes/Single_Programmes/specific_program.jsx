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
      <section className="header-section">
        <h3 className="text-center">Les sous domaines et cours</h3>
        <div className="d-flex flex-column">
          <p>
            Le coaching est un processus d'accompagnement personnalisé qui vise
            à améliorer les performances et le bien-être d'un individu, d'un
            groupe ou d'une organisation. Cette pratique repose sur
            l'établissement d'une relation de confiance entre le coach et le
            coaché. Le coach aide le coaché à identifier ses objectifs
            personnels ou professionnels, à reconnaître ses forces et ses
            faiblesses, et à développer des stratégies pour atteindre ses buts.
            L'approche est centrée sur le coaché, favorisant ainsi une prise de
            conscience et un développement personnel ou professionnel. Le
            coaching se distingue par son orientation vers des solutions
            concrètes et son focus sur l'action, aidant le coaché à surmonter
            les obstacles et à réaliser pleinement son potentiel.
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
      <section className="cours-section my-5">
        <h3 className="text-center">Cours Links</h3>
        <div className="d-flex justify-content-center flex-wrap">
          {getCoursLinks().map((link, index) => {
            const videoId = getYouTubeVideoId(link);
            const isYouTubeLink = videoId !== null;
            const embedUrl = isYouTubeLink
              ? `https://www.youtube.com/embed/${videoId}`
              : null;

            return (
              <div key={index} className="card w-100 mx-2 my-2">
                <div className="card-body">
                  {/* Course Title */}
                  <h5 className="card-title">Cours {index + 1}</h5>

                  {/* YouTube Iframe or Website Link */}
                  {isYouTubeLink ? (
                    <iframe
                      width="1060"
                      height="690"
                      src={embedUrl}
                      title={`YouTube video player ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
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
