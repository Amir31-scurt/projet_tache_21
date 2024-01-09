import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { getDoc, doc } from 'firebase/firestore';

export default function Cours() {
  const { domaineId, sousDomaineName } = useParams();
  const [courses, setCourses] = useState([]);
  const [display, setDisplay] = useState(false);
  const [changement, setChangement] = useState(false);
  const [livraison, setLivraison] = useState(true);
  const handleDisplay = () => {
    setDisplay(true);
    setChangement(true);
    setLivraison(false);
  };
  const handleChangement = () => {
    setChangement(true);
  };
  const [backdrop, setBackdrop] = React.useState('static');
  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const [files, setFiles] = useState();
  const [previews, setPreviews] = useState();

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

  const handleUpload = async (user) => {
    // Loop through selected files and upload each to Firebase Storage
    selectedFiles.forEach((file) => {
      const storageRef = ref(storage, `Images/${UserUid}/${file.name}`);
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) =>{
          // Handle the download URL, you can use it as needed
        });
      });
    });
    // Clear selected files
    setSelectedFiles([]);
    // Close the modal
    setOpen(false);

    if (selectedFiles.length > 0 ) {
      // Loop through selected files and add each to Firestore
      selectedFiles.forEach(async (file) => {
        const imageUrls = [];
        const storageRef = ref(storage, `Images/${UserUid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
        // Ajouter la publication dans Firestore avec l'URL de l'image
        await addDoc(collection(db, 'publication'), {
        userID: UserUid,
        profile: user.photoURL || '', // Assurez-vous que user.photoURL est défini
        nom: user.displayName || '', // Assurez-vous que user.displayName est défini
        date: format(new Date(), 'dd/MM/yyyy - HH:mm:ss'),
        publication: imageUrls   ,
        email: UserEmail,
        });
      });

      // Clear selected files
      setSelectedFiles([]);
      // Close the modal
      setOpen(false);
    }
    
  };

  const getYouTubeVideoId = (url) => {
    if (typeof url !== 'string') {
      return null;
    }
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const docRef = doc(db, 'domaines', domaineId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const domaineData = docSnap.data();
          console.log(domaineData);
          const sousDomaine = domaineData.sousDomaines[sousDomaineName];
          if (sousDomaine && sousDomaine.cours) {
            setCourses(sousDomaine.cours); // Assuming cours is an array
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
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className={` btn text-white ${
                        livraison ? 'd-none' : 'd-block'
                      }`}
                      onClick={handleOpen}
                      style={{ backgroundColor: '#48a93c' }}
                    >
                      Livrer
                    </button>
                    <button
                      className={` btn text-white ${
                        changement ? 'd-none' : 'd-block'
                      }`}
                      onClick={handleDisplay}
                      style={{ backgroundColor: '#48a93c' }}
                    >
                      Demarer
                    </button>
                    <button
                      onClick={handleChangement}
                      className={` btn text-white ${
                        display ? 'd-block' : 'd-none'
                      }`}
                      style={{ backgroundColor: '#3084b5' }}
                    >
                      Terminer
                    </button>
                  </div>
                </Card>
              </div>
            );
          })}
          <div className="text-end mt-2 gap-2 d-flex justify-content-end ">
            <Modal
              backdrop={backdrop}
              keyboard={false}
              open={open}
              onClose={handleClose}
            >
              <Modal.Header>
                <Modal.Title>Envoyer mon travail</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <textarea
                    placeholder="description"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                {previews &&
                  previews.map((pic) => {
                    return (
                      <div className="d-flex m-3 ">
                        <img src={pic} className="output " />
                      </div>
                    );
                  })}
                <div className="text-center mt-4">
                  <label
                    for="formFileLg"
                    id="myfiles"
                    className="form-label inputStyle "
                  >
                    Choisir Fichiers
                  </label>

                  <input
                    className="form-control d-none "
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFiles(e.target.files);
                      }
                    }}
                    multiple
                    accept="image/*"
                    id="formFileLg"
                    type="file"
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" className="inputStyle">
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
