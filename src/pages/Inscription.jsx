import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdMail } from 'react-icons/io';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { auth, db, storage } from '../config/firebase-config';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inscription = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [actived, setActived] = useState(true);

  const navigate = useNavigate();
  const formRegister = useRef();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Récupération des informations entrées par l'utilisateur
    const displayName = formRegister.current.nom.value;
    const email = formRegister.current.mail.value;
    const password = formRegister.current.mdpass.value;
    // // const confirmPassword = e.target[3].value;
    const file = formRegister.current.fichier.value;
    console.log(displayName);
    console.log(email);
    console.log(password);
    console.log(file);

    try {
      // Création de l'utilisateur
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Créer un nom d'image unique dans le Storage de firebase
      const date = new Date().getTime();
      // Concaténation du nom de l'user et de la date pour créer un nom unique
      const storageRef = ref(storage, `${displayName + date}`);

      // La fonction uploadBytesResumable est utilisée pour téléverser des octets de manière reprise, ce qui signifie que si le téléversement est interrompu pour une raison quelconque, il peut être repris à partir du point où il s'est arrêté
      uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Mis à jour du profil
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //Création de l'utilisatreur dans le firestore
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //Créer un userChats (discussion de l'utilisateur) vide dans firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {});

            // Toast
            toast.success('Inscription réussie!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            });
            // On navigue
            navigate('/');
          } catch (err) {
            setErr(true);
            setLoading(false);
            toast.error("Erreur lors de l'inscription!", {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            });
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <form className="justify-content-center" ref={formRegister}>
      <div className="mb-3 input-group flex-nowrap">
        <span className="input-group-text">
          <FaUser />
        </span>
        <input
          required
          name="nom"
          type="text"
          className="form-control"
          placeholder="Votre nom"
        />
      </div>
      <div className="mb-3 input-group flex-nowrap">
        <span className="input-group-text">
          <IoMdMail />
        </span>
        <input
          required
          type="email"
          name="mail"
          className="form-control"
          placeholder="Votre email"
        />
      </div>
      <div className="mb-3 input-group flex-nowrap ps-0 form-check">
        <span className="input-group-text">
          <RiLockPasswordFill />
        </span>
        <input
          required
          type="password"
          name="mdpass"
          className="form-control"
          placeholder="Votre mot de passe"
        />
      </div>
      {/* <div className="mb-3 ps-0 form-check">
              <input
                required
                type="password"
                className="form-control"
                placeholder="Confirm password"
              />
            </div> */}
      <div className="mb-3 input-group flex-nowrap ps-0 form-check">
        <input
          // required
          style={{ display: 'none' }}
          name="fichier"
          type="file"
          id="file"
        />
        <label htmlFor="file">
          {/* <img src={Add} alt="" /> */}
          <i className="bi bi-card-image me-3"></i>
          <span>Choisir l'image de profil</span>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="btn d-flex justify-content-center align-items-center fs-6 btn-lg btn-block text-white log"
        type="button"
      >
        S'inscrire
      </button>
      <ToastContainer />
      {/* <button type="submit" className="btn btn-primary" disabled={loading}>
        Sign In
      </button> */}
      {/* {err && <span style={{ color: "red" }}>Quelque chose d'anormale</span>} */}
    </form>
  );
};
export default Inscription;
