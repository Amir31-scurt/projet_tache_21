import React, { useEffect, useState, useContext } from 'react';
import '../../../assets/css/single-program.css'; // This is where you'd put your CSS
import { SelectPicker } from 'rsuite';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import { EmailContext } from '../../../contexte/EmailContexte';

const SpecificPro = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [newCourseLink, setNewCourseLink] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState();
  const [notificationsCollection] = useState(collection(db, 'notifications'));
  const [coachDoc, setCoachDoc] = useState([]);
  const [adminDoc, setAdminDoc] = useState('');
  const [coachSousDomaine, setCoachSousDomaine] = useState('');
  const { email, setEmail } = useContext(EmailContext);
  const [coachName, setCoachName] = useState([]);

  useEffect(() => {
    const fetchCoachDetails = async () => {
      // Replace this with the actual email or how you get the email
      const coachEmail = localStorage.getItem('userEmail');
      console.log('Fetching details for email:', coachEmail);

      if (coachEmail) {
        try {
          const q = query(
            collection(db, 'utilisateurs'),
            where('email', '==', coachEmail)
          );

          const querySnapshot = await getDocs(q);
          console.log(`Number of documents found: ${querySnapshot.size}`);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((docSnapshot) => {
              const userData = docSnapshot.data();
              console.log('Document found:', userData);
              if (userData.role === 'Coach') {
                setCoachSousDomaine(userData.sousDomaines);
                setCoachName(userData.name); // Update the coach name state
                console.log(coachSousDomaine);
              }
            });
          } else {
            console.log('No coach found with the provided email');
          }
        } catch (error) {
          console.error('Error fetching coach details:', error);
        }
      } else {
        console.log('No coach email provided');
      }
    };

    fetchCoachDetails();
  }, []);

  const loadUsers = React.useCallback(() => {
    try {
      const usersCollection = collection(db, 'utilisateurs');
      const unsubscribe = onSnapshot(
        query(usersCollection, where('email', '==', email)),
        (snapshot) => {
          const userData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCoachDoc(userData);
        }
      );

      const unsubscribeAdmin = onSnapshot(
        query(usersCollection, where('role', '==', 'Administrateur')),
        (snapshot) => {
          const adminEmails = snapshot.docs.find((doc) => doc.data().email);
          setAdminDoc(adminEmails);
        }
      );

      return () => {
        unsubscribe();
        unsubscribeAdmin();
      };
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    if (coachDoc.length > 0) {
      setCoachName(coachDoc[0].name);
    }
  }, [loadUsers, coachDoc]);

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
    if (
      !newCourseLink ||
      !newCourseTitle ||
      !newCourseDescription ||
      !selectedSousDomaine
    ) {
      toast.error('Tous les champs doivent être remplis', {
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

    const newCourse = {
      link: newCourseLink,
      title: newCourseTitle,
      description: newCourseDescription,
    };

    const docRef = doc(db, 'domaines', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const domaineData = docSnap.data();
      const sousDomaineData = domaineData.sousDomaines[selectedSousDomaine];

      if (sousDomaineData) {
        const updatedCours = sousDomaineData.cours
          ? [...sousDomaineData.cours, newCourse]
          : [newCourse];
        const updatedSousDomaines = {
          ...domaineData.sousDomaines,
          [selectedSousDomaine]: { ...sousDomaineData, cours: updatedCours },
        };

        try {
          await updateDoc(docRef, {
            sousDomaines: updatedSousDomaines,
          });

          // Sending notification to admin
          // const notificationMessage = `Le coach ${coachName} vient d'ajouter un cours sur ${newCourse.title}.`;
          // await addDoc(notificationsCollection, {
          //   messageForAdmin: notificationMessage,
          //   timestamp: serverTimestamp(),
          //   newNotif: true,
          //   email: adminDoc ? adminDoc.email : undefined,
          // });

          // Clearing the input fields
          setNewCourseLink('');
          setNewCourseTitle('');
          setNewCourseDescription('');

          // Display success toast
          toast.success('Cours ajouté avec succès', {
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
          console.error('Error updating document: ', error);
          toast.error("Erreur lors de l'ajout du cours", {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      } else {
        toast.error('Sous-domaine non trouvé', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    } else {
      console.log('Document not found');
    }
  };

  // Lien des cours dans une cartes
  const getCoursLinks = () => {
    if (!selectedSousDomaine || !courseData.sousDomaines) {
      return [];
    }

    const selectedDomaine = courseData.sousDomaines[selectedSousDomaine];
    return selectedDomaine && selectedDomaine.cours
      ? selectedDomaine.cours.map((course) => course) // Make sure to map to the 'link' property
      : [];
  };

  const getYouTubeVideoId = (url) => {
    if (typeof url !== 'string') {
      return null;
    }
    // eslint-disable-next-line
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [modifiedTitle, setModifiedTitle] = useState('');
  const [modifiedDescription, setModifiedDescription] = useState('');
  const [modifiedLink, setModifiedLink] = useState('');
  const [editedIndex, setEditedIndex] = useState(null);

  // ... (le reste du code)

  const handleEditClick = (index) => {
    const selectedCourse = getCoursLinks()[index];
    setModifiedTitle(selectedCourse.title);
    setModifiedDescription(selectedCourse.description);
    setModifiedLink(selectedCourse.link);
    setIsEditing(true);
    setEditedIndex(index);
  };

  const handleSaveEdit = async (index) => {
    const selectedCourse = getCoursLinks()[index];

    // Assurez-vous d'obtenir la référence correcte du document à mettre à jour
    const docRef = doc(db, 'domaines', courseId);

    // Obtenez le snapshot actuel du document
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Obtenez les données actuelles
      const currentData = docSnapshot.data();

      // Assurez-vous que vous avez les références correctes dans votre structure de données
      const currentSousDomaines = currentData.sousDomaines || {};
      const currentCours =
        currentSousDomaines[selectedSousDomaine]?.cours || [];

      // Mettez à jour le cours sélectionné
      currentCours[index] = {
        link: modifiedLink,
        title: modifiedTitle,
        description: modifiedDescription,
      };

      // Mettez à jour les données sousDomaines avec le cours modifié
      const updatedSousDomaines = {
        ...currentSousDomaines,
        [selectedSousDomaine]: {
          ...currentSousDomaines[selectedSousDomaine],
          cours: currentCours,
        },
      };

      try {
        // Mettez à jour le document dans Firestore
        await updateDoc(docRef, {
          sousDomaines: updatedSousDomaines,
        });

        // Mettez à jour l'état local si nécessaire
        setCourseData({ ...currentData, sousDomaines: updatedSousDomaines });

        // Réinitialisez les états après la sauvegarde
        setIsEditing(false);
        setModifiedTitle('');
        setModifiedDescription('');
        setModifiedLink('');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du document :', error);
      }
    } else {
      console.log("Aucun document trouvé avec l'ID du domaine fourni");
    }
  };

  const handleArchive = async (index) => {
    const selectedCourse = getCoursLinks()[index];

    // Assurez-vous d'obtenir la référence correcte du document à mettre à jour
    const docRef = doc(db, 'domaines', courseId);

    // Obtenez le snapshot actuel du document
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Obtenez les données actuelles
      const currentData = docSnapshot.data();

      // Assurez-vous que vous avez les références correctes dans votre structure de données
      const currentSousDomaines = currentData.sousDomaines || {};
      const currentCours =
        currentSousDomaines[selectedSousDomaine]?.cours || [];

      // Marquer le cours comme archivé
      currentCours[index].archived = true;

      // Mettez à jour les données sousDomaines avec le cours archivé
      const updatedSousDomaines = {
        ...currentSousDomaines,
        [selectedSousDomaine]: {
          ...currentSousDomaines[selectedSousDomaine],
          cours: currentCours,
        },
      };

      try {
        // Mettez à jour le document dans Firestore
        await updateDoc(docRef, {
          sousDomaines: updatedSousDomaines,
        });

        // Mettez à jour l'état local si nécessaire
        setCourseData({ ...currentData, sousDomaines: updatedSousDomaines });

        toast.success('Cours archivé avec succès', {
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
        console.error("Erreur lors de l'archivage du cours :", error);
      }
    } else {
      console.log("Aucun document trouvé avec l'ID du domaine fourni");
    }
  };
  const handleUnarchive = async (index) => {
    const selectedCourse = getCoursLinks()[index];

    // Assurez-vous d'obtenir la référence correcte du document à mettre à jour
    const docRef = doc(db, 'domaines', courseId);

    // Obtenez le snapshot actuel du document
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // Obtenez les données actuelles
      const currentData = docSnapshot.data();

      // Assurez-vous que vous avez les références correctes dans votre structure de données
      const currentSousDomaines = currentData.sousDomaines || {};
      const currentCours =
        currentSousDomaines[selectedSousDomaine]?.cours || [];

      // Marquer le cours comme non archivé
      currentCours[index].archived = false;

      // Mettez à jour les données sousDomaines avec le cours désarchivé
      const updatedSousDomaines = {
        ...currentSousDomaines,
        [selectedSousDomaine]: {
          ...currentSousDomaines[selectedSousDomaine],
          cours: currentCours,
        },
      };

      try {
        // Mettez à jour le document dans Firestore
        await updateDoc(docRef, {
          sousDomaines: updatedSousDomaines,
        });

        // Mettez à jour l'état local si nécessaire
        setCourseData({ ...currentData, sousDomaines: updatedSousDomaines });

        toast.success('Cours désarchivé avec succès', {
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
        console.error('Erreur lors du désarchivage du cours :', error);
      }
    } else {
      console.log("Aucun document trouvé avec l'ID du domaine fourni");
    }
  };

  return (
    <div>
      <h1 className="fst-italic text-secondary fs-3 fw-bold ps-2 pt-3">
        Les Cours
      </h1>
      <div className="main-container">
        <section className="header-section">
          <h3 className="text-center">Les sous domaines et cours</h3>
          <div className="d-flex flex-column">
            <p>
              Le coaching est un processus d'accompagnement personnalisé qui
              vise à améliorer les performances et le bien-être d'un individu,
              d'un groupe ou d'une organisation. Cette pratique repose sur
              l'établissement d'une relation de confiance entre le coach et le
              coaché. Le coach aide le coaché à identifier ses objectifs
              personnels ou professionnels, à reconnaître ses forces et ses
              faiblesses, et à développer des stratégies pour atteindre ses
              buts. L'approche est centrée sur le coaché, favorisant ainsi une
              prise de conscience et un développement personnel ou
              professionnel. Le coaching se distingue par son orientation vers
              des solutions concrètes et son focus sur l'action, aidant le
              coaché à surmonter les obstacles et à réaliser pleinement son
              potentiel.
            </p>
            <hr />
            <h5 className="mb-3 text-center">Ajouter des cours</h5>
            <div className="d-flex flex-column flex-wrap gap-2 justify-content-center align-items-center col-lg-6 mx-auto mx-lg-0 addCours">
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
              <input
                type="text"
                name="TitreDeCours"
                id="TitreDeCours"
                placeholder="Titre de cours"
                className="w-100 rounded p-1 border-secondary border-opacity-25 border-1"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
              <input
                type="text"
                name="DescriptionDeCours"
                id="DescriptionDeCours"
                placeholder="Description cours"
                className="w-100 rounded p-1 border-secondary border-opacity-25 border-1"
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
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
            {getCoursLinks().map((course, index) => {
              // const videoId = getYouTubeVideoId(course.link);
              return (
                <div key={index} className="card mx-2 my-2">
                  <div className="card-body">
                    {isEditing && index === editedIndex ? (
                      <>
                        <div className="d-flex flex-column mes-input">
                          <h5 className="d-flex">
                            Cours{index + 1}:
                            <input
                              className="border-none w-100 "
                              type="text"
                              value={modifiedTitle}
                              onChange={(e) => setModifiedTitle(e.target.value)}
                            />
                          </h5>
                          <p className="card-text  d-flex ">
                            <strong className="">Description:</strong>
                            <textarea
                              className="text-wrap border-none w-100 mb-2 "
                              type="text"
                              value={modifiedDescription}
                              onChange={(e) =>
                                setModifiedDescription(e.target.value)
                              }
                            />
                          </p>
                          <a href="">
                            <input
                              className=" border-none w-100"
                              type="text"
                              value={modifiedLink}
                              onChange={(e) => setModifiedLink(e.target.value)}
                            />
                          </a>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSaveEdit(index)}
                          >
                            Sauvegarder
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5>
                          Cours {index + 1} : {course.title}
                        </h5>
                        <p className="card-text mb-2">
                          <strong>Description : </strong>
                          {course.description}
                        </p>
                        {course.archived ? (
                          <div>
                            <p className="text-danger">Archivé</p>
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => handleUnarchive(index)}
                            >
                              Désarchiver
                            </button>
                          </div>
                        ) : (
                          <>
                            <a
                              href={course.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {course.link}
                            </a>
                            <div className="mt-5 text-end">
                              <button
                                type="button"
                                className="btn btn-primary mx-2"
                                onClick={() => handleEditClick(index)}
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                className="btn btn-warning mx-2"
                                onClick={() => handleArchive(index)}
                              >
                                Archiver
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ToastContainer />
      </div>
    </div>
  );
};

export default SpecificPro;
