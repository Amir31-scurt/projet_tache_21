import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { getDoc, doc } from 'firebase/firestore';

export default function Cours() {
  const { domaineId, sousDomaineName } = useParams();
  function CarteCours() {
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
            const sousDomaine = domaineData.sousDomaines[sousDomaineName];
            console.log(sousDomaine);

            // Check if sousDomaine and sousDomaine.cours exist
            if (sousDomaine && Array.isArray(sousDomaine.cours)) {
              setCourses(sousDomaine.cours); // Assuming cours is already an array
              console.log(sousDomaine.cours);

              // Map over the cours array
              courses.forEach((course) => {
                console.log(`Title: ${course.title}`);
                console.log(`Link: ${course.link}`);
                console.log(`Description: ${course.description}`);
              });
            } else {
              console.log('No courses found for the provided sous-domaine');
            }
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching courses: ', error);
        }
      };

      console.log('Domaine ID:', domaineId);
      console.log('Sous Domaine Name:', sousDomaineName);

      fetchCourses();
    }, [domaineId, sousDomaineName]);

    return (
      <div className="card" style={{ padding: '20px' }}>
        {courses.map((course, index) => {
          const videoId = getYouTubeVideoId(course);
          const isYouTubeLink = videoId !== null;
          const embedUrl = isYouTubeLink
            ? `https://www.youtube.com/embed/${videoId}`
            : null;

          return (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <Card style={{ padding: '20px' }}>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                {isYouTubeLink ? (
                  <iframe
                    src={embedUrl}
                    title={`YouTube video player for ${course.title}`}
                    allowFullScreen
                    width="100%"
                    height="250px"
                  ></iframe>
                ) : (
                  <a href={course} target="_blank" rel="noopener noreferrer">
                    {course}
                  </a>
                )}
                <div className="d-flex justify-content-end">
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
    );
  }

  return (
    <div className="bg-cours p-2">
      <h2>Course List</h2>
      <div className="container">
        <div className="row">
          <CarteCours domaineId={domaineId} sousDomaineName={sousDomaineName} />
        </div>
      </div>
    </div>
  );
}
