import React, { useState, useEffect, useContext, useId } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { useParams } from 'react-router-dom';
import { db, storage } from '../../config/firebase-config';
import { getDoc, doc, collection, addDoc, serverTimestamp,onSnapshot, getDocs, where, updateDoc, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../contexte/AuthContext';
import { format } from 'date-fns';

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
  const [LeNom, setLeNom] = useState('')
  const [docPubRef, setDocPubRef] = useState("");;

  const UserUid = uid;
  const UserEmail = currentUser.email;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(db, 'utilisateurs');
        const q = query(usersCollectionRef, where("email", "==", UserEmail));
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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [UserUid]);

  const UserName = LeNom || currentUser.displayName; ;

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
      const publicationCollectionRef = collection(db, "publish");
      const publicationQuery = query(
        publicationCollectionRef,
        where("userID", "==", UserUid),
        where("cours", "==", selectedCourseTitle)
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
      console.error("Erreur lors du traitement du téléchargement :", error);
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
            const formattedCourses = sousDomaine.cours.map((course) => ({
              ...course,
              display: false,
              changement: false,
              livraison: true,
            }));
            setCourses(formattedCourses);
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

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (days > 0) {
      return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${
        minutes > 1 ? 's' : ''
      } ${remainingSeconds} seconde${remainingSeconds > 1 ? 's' : ''}`;
    }
  };

  const handleDisplay = async (courseIndex) => {
    const course = courses[courseIndex];

    // const docRef = await addDoc(collection(db, "publication"), {
    //   userID: UserUid,
    //   cours: course.title,
    //   nom: UserName,
    //   profile: "",
    //   date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    //   images: imageUrls,
    //   email: UserEmail || "",
    //   start: true,
    //   finish: false,
    //   livree: false,
    //   duree: 0,
    // });

    // Vérifier s'il existe déjà un document avec le même utilisateur et cours
    const publicationCollectionRef = collection(db, "publication");
    const publicationQuery = query(
      publicationCollectionRef,
      where("userID", "==", UserUid),
      where("cours", "==", course.title)
    );
    const publicationQuerySnapshot = await getDocs(publicationQuery);

    if (publicationQuerySnapshot.empty) {
      // Créer un nouveau document s'il n'y a pas de document existant
      setDocPubRef( await addDoc(collection(db, "publish"), {
        userID: UserUid,
        cours: course.title,
        nom: UserName,
        profile: "",
        date: serverTimestamp(),
        email: UserEmail || "",
        start: true,
        finish: false,
        livree: false,
        duree: 0,
      }));
    }

    setCourses((courses) =>
      courses.map((course, index) => {
        if (index === courseIndex) {
          return {
            ...course,
            display: true,
            changement: true,
            livraison: false,
          };
        }
        return course;
      })
    );
    const timerInterval = setInterval(() => {
      setTimers((prevTimers) => ({
        ...prevTimers,
        [courseIndex]: (prevTimers[courseIndex] || 0) + 1,
      }));
    }, 1000);

    setIntervalIds((prevIds) => ({
      ...prevIds,
      [courseIndex]: timerInterval,
    }));

    setCurrentDocRef(docPubRef);
  };

  const handleChangement = (courseIndex) => {
    setCourses((courses) =>
      courses.map((course, index) => {
        if (index === courseIndex) {
          return { ...course, changement: true };
        }
        return course;
      })
    );
    clearInterval(intervalIds[courseIndex]);
    setIntervalIds((prevIds) => ({
      ...prevIds,
      [courseIndex]: null,
    }));
  };

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

  // Function to render buttons for each course
  const renderCourseButtons = (course, index) => {
    return (
      <div className="d-flex gap-2 justify-content-end">
        <button
          onClick={() => handleOpen(index)}
          className={`btn text-white ${
            course.livraison ? 'd-none' : 'd-block'
          }`}
          style={{ backgroundColor: '#48a93c' }}
        >
          Livrer
        </button>
        <button
          onClick={() => handleDisplay(index)}
          className={`btn text-white ${
            course.changement ? 'd-none' : 'd-block'
          }`}
          style={{ backgroundColor: '#48a93c' }}
        >
          Démarrer
        </button>
        <button
          onClick={() => handleChangement(index)}
          className={`btn text-white ${course.display ? 'd-block' : 'd-none'}`}
          style={{ backgroundColor: '#3084b5' }}
        >
          Terminer
        </button>
      </div>
    );
  };

  return (
    <div className="bg-cours p-2">
      <h2>Course List</h2>
      <div className="container">
        <div className="row">
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
                  <p key={index}>{`Durée: ${formatTime(
                    timers[index] || 0
                  )}`}</p>
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