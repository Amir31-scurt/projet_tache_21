import React, { useState, useEffect, useContext,  } from 'react';
import { Card } from 'primereact/card';
import { Modal } from 'rsuite';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../config/firebase-config';
import AuthContextProvider, { AuthContext } from '../../contexte/AuthContext';


export default function Cours() {
  const [display, setDisplay] = useState(false);
  const [changement, setChangement] = useState(false);
  const [livraison, setLivraison] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [backdrop, setBackdrop] = useState('static');

  const {currentUser, uid} = useContext(AuthContext);
  
  const  UserEmail = currentUser.email;
  const UserUid = uid ; 
  console.log("Le uid =", UserUid);

  const handleDisplay = () => {
    setDisplay(true);
    setChangement(true);
    setLivraison(false);
  };

  const handleChangement = () => {
    setChangement(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
      // Lo op through selected files and add each to Firestore
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

  return (
    <div className="card" style={{ padding: '20px' }}>
      <Card style={{ border: '1px solid #48a93c', padding: '30px' }}>
        <h5>html</h5>
        <p>durée</p>
        <p className="">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam
          repellat libero asperiores earum nam nobis, culpa ratione quam
          perferendis esse, cupiditate neque quas!
        </p>
      </Card>

      <div className="text-end mt-2 gap-2 d-flex justify-content-end ">
        <Modal backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>Envoyer mon travail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <textarea
                placeholder="description"
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              ></textarea>
            </div>
            {previews &&
              previews.map((pic) => {
                return (
                  <div className="d-flex m-3 " key={pic}>
                    <img src={pic} className="output " alt="Preview" />
                  </div>
                );
              })}
            <div className="text-center mt-4">
              <label htmlFor="formFileLg" id="myfiles" className="form-label inputStyle ">
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
            <button type="submit" onClick={handleUpload} className="inputStyle">
              Envoyer
            </button>
          </Modal.Footer>
        </Modal>
        <button
          className={` btn text-white ${livraison ? 'd-none' : 'd-block'}`}
          onClick={handleOpen}
          style={{ backgroundColor: '#48a93c' }}
        >
          Livrer
        </button>
        <button
          className={` btn text-white ${changement ? 'd-none' : 'd-block'}`}
          onClick={handleDisplay}
          style={{ backgroundColor: '#48a93c' }}
        >
          Demarer
        </button>
        <button
          onClick={handleChangement}
          className={` btn text-white ${display ? 'd-block' : 'd-none'}`}
          style={{ backgroundColor: '#3084b5' }}
        >
          Terminer
        </button>
      </div>
    </div>
  );
}
