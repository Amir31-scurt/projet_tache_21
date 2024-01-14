import React, { useState, useEffect, useContext, useId } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../../config/firebase-config';
import {
  getDoc,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  where,
  updateDoc,
  query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../contexte/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import UserProfil from '../../assets/images/user.png';
import { ToastContainer, toast } from 'react-toastify';
import ProgressBar from './ProgressBar';

export default function Cours() {
  const { domaineId, sousDomaineName } = useParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [backdrop, setBackdrop] = useState('static');
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();
  const [timers, setTimers] = useState({}); // Timer state as an object
  const [intervalIds, setIntervalIds] = useState({}); // To store interval IDs
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [currentDocRef, setCurrentDocRef] = useState(null);
  const { currentUser, uid } = useContext(AuthContext);
  const [LeNom, setLeNom] = useState('');
  const [docPubRef, setDocPubRef] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [timeoutIds, setTimeoutIds] = useState({});
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(false);

  const UserUid = uid;
  const UserEmail = currentUser.email;
  const [profileImage, setProfileImage] = useState(UserProfil);

  // Utilisez useEffect pour mettre à jour l'image de profil après la reconnexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Mettez à jour l'image de profil après la reconnexion
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        getDownloadURL(storageRef)
          .then((url) => {
            setProfileImage(url);
            localStorage.setItem('profileImage', url);
          })
          .catch((error) => {
            console.error('Error loading profile image:', error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let isSubscribed = true; // Traquer si le composant
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(db, 'utilisateurs');
        const q = query(usersCollectionRef, where('email', '==', UserEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Il y a au moins un document correspondant à UserUid
          const userData = querySnapshot.docs[0].data();
          const studentName = userData.name;
          setLeNom(studentName);
        } else {
          console.log("Le user ID n'existe pas :", UserUid);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
    return () => {
      isSubscribed = false; // Component is unmounting, no longer subscribed
    };
  }, [UserUid]);

  const UserName = LeNom || currentUser.displayName;

  console.log("le nom de l'etudiant =", UserName);

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

  const imageUrls = [];
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

    // Set the loading state for this specific course to true
    setLoadingStates((prev) => ({ ...prev, [course.id]: true }));

    const publicationCollectionRef = collection(db, 'publication');
    const publicationQuery = query(
      publicationCollectionRef,
      where('userID', '==', UserUid),
      where('cours', '==', course.title)
    );
    const publicationQuerySnapshot = await getDocs(publicationQuery);

    if (publicationQuerySnapshot.empty) {
      // If there's no existing document, create a new one
      const newDocRef = await addDoc(collection(db, 'publication'), {
        userID: UserUid,
        cours: course.title,
        nom: UserName,
        profile: profileImage,
        images: imageUrls, // Make sure this is the array of image URLs
        date: serverTimestamp(),
        email: UserEmail || '',
        start: true,
        finish: false,
        livree: false,
        duree: 0,
        valider: false
      });

      toast.success(
        'Vous avez démarré le cours, compte à rebours de 2 minutes',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );

      // Store the new document reference in docPubRef
      setDocPubRef((prevRefs) => ({
        ...prevRefs,
        [course.title]: newDocRef,
      }));
    } else {
      // If a document exists, store its reference
      const existingDocRef = publicationQuerySnapshot.docs[0].ref;
      setDocPubRef((prevRefs) => ({
        ...prevRefs,
        [course.title]: existingDocRef,
      }));
    }

    const completionTimer = setTimeout(() => {
      handleChangement(courseIndex);
      toast.warning('Durée de cours épuisé', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }, 120000);

    setLoadingStates((prev) => ({ ...prev, [course.id]: false }));

    // Corrected way to update setTimeoutIds using functional update
    setTimeoutIds((prevIds) => ({
      ...prevIds,
      [courseIndex]: completionTimer,
    }));

    // Update the courses state
    setCourses((courses) =>
      courses.map((c, index) => {
        if (index === courseIndex) {
          return {
            ...c,
            display: true,
            changement: true,
            livraison: false,
          };
        }
        return c;
      })
    );

    // Reset the loading state for this course
    setLoadingStates((prev) => ({ ...prev, [course.id]: false }));
  };

  const handleChangement = async (courseIndex) => {
    const course = courses[courseIndex];

    setIsButtonsDisabled(true);

    if (docPubRef[course.title]) {
      const courseDocRef = docPubRef[course.title];

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
        const courseDocRef = docPubRef[course.title];
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
  }, [courses, docPubRef]);

  useEffect(() => {
    const fetchCourseStates = async () => {
      const querySnapshot = await getDocs(collection(db, 'publication'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setCourses((prevCourses) =>
          prevCourses.map((course) => {
            if (course.title === data.cours && data.email === UserEmail) {
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

  // Progress Bar
  // Part of Cours component
  const calculateCompletionProgress = () => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(
      (course) => course.isCompleted
    ).length;
    return (completedCourses / totalCourses) * 100;
  };

  // Use this function to get the progress value
  const completionProgress = calculateCompletionProgress();
  useEffect(() => {
    // Recalculate the completion progress whenever courses data changes
    const newProgress = calculateCompletionProgress();
    // Optionally, you can use a state to store this progress if needed elsewhere
  }, [courses]);

  const handleClose = () => setOpen(false);

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
      <h2>Liste des cours</h2>
      <div className="container">
        <div className="row">
          <div className="my-5 w-50">
            <h3>Cours Complets :</h3>{' '}
            <ProgressBar progress={completionProgress} />
          </div>
          {courses.map((course, index) => {
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
                  {renderCourseButtons(course, index)}
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
                  className="inputStyle"
                >
                  Envoyer
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
