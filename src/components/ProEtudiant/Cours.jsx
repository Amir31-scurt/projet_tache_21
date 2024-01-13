import React, { useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../config/firebase-config';
import {
  getDoc,
  doc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  where,
  query,
} from 'firebase/firestore';
import { AuthContext } from '../../contexte/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Cours() {
  const { domaineId, sousDomaineName } = useParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [backdrop, setBackdrop] = useState('static');
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [docRefs, setDocRefs] = useState({});
  const [timeoutIds, setTimeoutIds] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);

  const { currentUser, uid } = useContext(AuthContext);
  const [imageUrls, setImageUrls] = useState([]);

  const UserUid = uid;
  const UserEmail = currentUser.email;
  const UserName = currentUser.displayName;

  //
  useEffect(() => {
    if (!files) return;
    let tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
    }
    const objectUrls = tmp;
    setPreviews(objectUrls);

    // free memory
    for (let i = 0; i < objectUrls.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrls[i]);
      };
    }
  }, [files]);

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // free memory
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleUpload = async () => {
    try {
      // Boucler à travers les fichiers sélectionnés et les télécharger sur Firebase Storage
      await Promise.all(
        selectedFiles.map(async (file) => {
          const storageRef = ref(storage, `Images/${UserUid}/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          // Ajouter l'URL au tableau
          imageUrls.push(url);
        })
      );

      // Effacer les fichiers sélectionnés
      setSelectedFiles([]);
      // Fermer la fenêtre modale
      setOpen(false);

      // Vérifier s'il existe un document existant avec le même cours et le même utilisateur
      const publicationCollectionRef = collection(db, 'publication');
      const publicationQuery = query(
        publicationCollectionRef,
        where('userID', '==', UserUid),
        where('cours', '==', selectedCourseTitle)
      );
      const publicationQuerySnapshot = await getDocs(publicationQuery);

      if (!publicationQuerySnapshot.empty) {
        // Mettre à jour le document existant avec les nouvelles et anciennes images
        const existingDocRef = publicationQuerySnapshot.docs[0].ref;

        // Récupérer les images actuelles du document existant
        const existingImages =
          publicationQuerySnapshot.docs[0].data().images || [];

        // Concaténer les anciennes images avec les nouvelles
        const imagesMisesAJour = [...imageUrls, ...existingImages];

        await updateDoc(existingDocRef, {
          date: serverTimestamp(),
          images: imagesMisesAJour,
        });
      }
    } catch (error) {
      console.error('Erreur lors du traitement du téléchargement :', error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const docRef = doc(db, 'domaines', domaineId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const domaineData = docSnap.data();
          const sousDomaine = domaineData.sousDomaines[sousDomaineName];
          if (sousDomaine && sousDomaine.cours) {
            const formattedCourses = sousDomaine.cours.map(async (course) => {
              // Fetch course data from 'publication' collection
              const publicationCollectionRef = collection(db, 'publication');
              const publicationQuery = query(
                publicationCollectionRef,
                where('cours', '==', course.title)
              );
              const publicationQuerySnapshot = await getDocs(publicationQuery);

              let isCourseCompleted = false;
              if (!publicationQuerySnapshot.empty) {
                const courseData = publicationQuerySnapshot.docs[0].data();
                // Check if course is completed based on 'start' and 'finish' flags
                isCourseCompleted =
                  courseData.finish === true && courseData.start === false;
              }

              return {
                ...course,
                display: false,
                changement: false,
                livraison: true,
                isCompleted: isCourseCompleted,
              };
            });

            // Use Promise.all to wait for all async operations to complete
            const resolvedCourses = await Promise.all(formattedCourses);
            setCourses(resolvedCourses);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [domaineId, sousDomaineName]);

  // Handlers for buttons
  const handleOpen = (courseIndex) => {
    setOpen(true);
    setSelectedCourse(courseIndex);
    const selectedCourse = courses[courseIndex];
    setSelectedCourseTitle(selectedCourse.title);
  };

  const handleDisplay = async (courseIndex) => {
    const course = courses[courseIndex];

    setLoadingStates((prev) => ({ ...prev, [course.id]: true }));

    const newDoc = await addDoc(collection(db, 'publication'), {
      UserUid,
      cours: course.title,
      nom: UserName,
      profile: '',
      images: imageUrls,
      date: serverTimestamp(),
      email: UserEmail || '',
      start: true,
      finish: false,
      livree: false,
      duree: 0,
    });

    setDocRefs((prevRefs) => ({
      ...prevRefs,
      [course.title]: newDoc, // Store the document reference against the course title
    }));
    toast.success('Cours debuté', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setCourses(
      courses.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            display: true, // Assuming 'display' controls whether the course is in progress
            changement: true, // Any other state changes specific to this course
            livraison: false, // Example of toggling other states
          };
        }
        return course; // Other courses remain unchanged
      })
    );

    const completionTimer = setTimeout(() => {
      handleChangement(courseIndex);
    }, 30000);

    setLoadingStates((prev) => ({ ...prev, [course.id]: false }));

    // Corrected way to update setTimeoutIds using functional update
    setTimeoutIds((prevIds) => ({
      ...prevIds,
      [courseIndex]: completionTimer,
    }));
  };

  const handleChangement = async (courseIndex) => {
    const course = courses[courseIndex];

    setIsButtonsDisabled(true);

    if (docRefs[course.title]) {
      const courseDocRef = docRefs[course.title];

      try {
        await updateDoc(courseDocRef, {
          start: false,
          finish: true,
        });
        toast.success('Cours Terminé', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } catch (error) {
        console.error('Error updating document in Firestore:', error);
      }
    }

    setCourses(
      courses.map((c, index) => {
        if (index === courseIndex) {
          return { ...c, isCompleted: true }; // Update local state
        }
        return c;
      })
    );
  };

  useEffect(() => {
    // Create an array to store Firestore update operations
    const updateOperations = [];

    // Iterate through the courses to check for isCompleted changes
    courses.forEach((course, index) => {
      if (course.isCompleted) {
        // If the course is marked as completed, update Firestore
        const courseDocRef = docRefs[course.title];
        if (courseDocRef) {
          // Push an update operation to the array
          updateOperations.push(
            updateDoc(courseDocRef, {
              start: false,
              finish: true,
            })
          );
        }
      }
    });

    // Perform all update operations in parallel
    Promise.all(updateOperations)
      .then(() => {
        // Handle success if needed
        console.log('Cours terminated successfully');
      })
      .catch((error) => {
        // Handle errors if needed
        toast.error('Error updating Firestore documents:', error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      });
  }, [courses, docRefs]);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchCourseStates = async () => {
      const querySnapshot = await getDocs(collection(db, 'publication'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setCourses((prevCourses) =>
          prevCourses.map((course) => {
            if (course.title === data.cours) {
              return {
                ...course,
                display: data.start,
                isCompleted: data.finish, // Reflect finish status from Firestore
              };
            }
            return course;
          })
        );
      });
    };

    fetchCourseStates();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const docRef = doc(db, 'domaines', domaineId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const domaineData = docSnap.data();
          const sousDomaine = domaineData.sousDomaines[sousDomaineName];
          if (sousDomaine && sousDomaine.cours) {
            const formattedCourses = sousDomaine.cours.map((course) => ({
              ...course,
              display: false, // Set initial display state
              isCompleted: course.finish, // Set completion status
              // Include any other initial states or transformations needed
            }));
            setCourses(formattedCourses);
          } else {
            console.log('No such sous-domaine!');
          }
        } else {
          console.log('No such domaine!');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [domaineId, sousDomaineName]);

  // File preview logic
  useEffect(() => {
    if (!files) return;
    const objectUrls = Array.from(files, (file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Function to get YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (typeof url !== 'string') return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const activeCourses = courses.filter((course) => !course.archived);

  // Function to render buttons for each course
  const renderCourseButtons = (course, index) => {
    const isAnyPrecedingCourseIncomplete = courses.some(
      (c, i) => i < index && !c.isCompleted
    );
    const shouldRenderTerminer = course.display && !course.isCompleted;
    const isLoading = loadingStates[course.id]; // Check if the current course is loading

    return (
      <div className="d-flex gap-2 justify-content-end">
        {isLoading ? (
          <button
            className="btn text-white"
            style={{ backgroundColor: '#48a93c' }}
            disabled
          >
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            &nbsp; &nbsp; Chargement...
          </button>
        ) : course.isCompleted || course.archived ? (
          <span className="btn text-muted">Terminée</span>
        ) : (
          <>
            {course.display && (
              <button
                onClick={() => handleOpen(index)}
                className="btn text-white"
                style={{ backgroundColor: '#48a93c' }}
                disabled={isAnyPrecedingCourseIncomplete || isLoading}
              >
                Livrer
              </button>
            )}
            {!course.display && !isAnyPrecedingCourseIncomplete && (
              <button
                onClick={() => handleDisplay(index)}
                className="btn text-white"
                style={{ backgroundColor: '#48a93c' }}
                disabled={isAnyPrecedingCourseIncomplete || isLoading}
              >
                Démarrer
              </button>
            )}
            {shouldRenderTerminer && (
              <button
                onClick={() => handleChangement(index)}
                className="btn text-white"
                style={{ backgroundColor: '#3084b5' }}
                disabled={isLoading}
              >
                Terminer
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-cours p-2">
      <h2>Course List</h2>
      <div className="container">
        <div className="row">
          {activeCourses.map((course, index) => {
            if (course.archived) {
              return null;
            }
            const videoId = getYouTubeVideoId(course.link);
            const isYouTubeLink = videoId !== null;
            const embedUrl = isYouTubeLink
              ? `https://www.youtube.com/embed/${videoId}`
              : null;

            return (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <Card style={{ padding: '20px' }}>
                  <h5>
                    Cours {index + 1} : {course.title}
                  </h5>
                  <p className="card-text mb-2">
                    <strong>Description: </strong>
                    {course.description}
                  </p>
                  {isYouTubeLink ? (
                    <iframe
                      src={embedUrl}
                      title={`YouTube video player for ${course.title}`}
                      allowFullScreen
                      width="100%"
                      height="250px"
                    ></iframe>
                  ) : (
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course.link}
                    </a>
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-5">
                    {/* <p className="p-0 m-0" key={index}>{`Durée: ${formatTime(
                      timers[course.id] || 0
                    )}`}</p> */}
                    {renderCourseButtons(course, index)}
                  </div>
                </Card>
              </div>
            );
          })}
          <div className="text-end mt-2 gap-2 d-flex justify-content-end">
            <Modal
              backdrop={backdrop}
              keyboard={false}
              open={open}
              onClose={() => {
                handleClose();
                setSelectedCourseTitle(''); // Reset the selected course title when closing the modal
              }}
            >
              <Modal.Header>
                <Modal.Title>Envoyer mon travail</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <div className="mb-3">
                    <label htmlFor="courseTitle" className="form-label">
                      Titre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="courseTitle"
                      value={selectedCourseTitle}
                      readOnly // Makes the input read-only
                    />
                  </div>
                  <textarea
                    placeholder="description"
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                {previews &&
                  previews.map((pic, idx) => (
                    <div key={idx} className="d-flex m-3">
                      <img src={pic} className="output" alt="Preview" />
                    </div>
                  ))}
                <div className="text-center mt-4">
                  <label
                    htmlFor="formFileLg"
                    id="myfiles"
                    className="form-label inputStyle btn text-white"
                  >
                    Choisir Fichiers
                  </label>
                  <input
                    className="form-control d-none "
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    id="formFileLg"
                    type="file"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="submit"
                  onClick={handleUpload}
                  className="inputStyle btn"
                >
                  Envoyer
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
