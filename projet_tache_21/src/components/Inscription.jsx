import React, { useRef, useState } from 'react';
// import pp from "../assets/images/user.png";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdMail } from 'react-icons/io';
import { ClipLoader } from 'react-spinners';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { auth, db } from '../config/firebase-config';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/inscription.css';

const Inscription = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [actived, setActived] = useState(true);
  const [validatePwd, setValidatePwd] = useState(false);

  const navigate = useNavigate();
  const formRegister = useRef();
  const imgUserRegisted = useRef();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Récupération des informations entrées par l'utilisateur
    const displayName = formRegister.current.nom.value;
    const email = formRegister.current.mail.value;
    const password = formRegister.current.mdpass.value;
    const confirmPassword = formRegister.current.mdpassConfirm.value;

    // Controle des mots de passe saisie par l'utilisateur
    if (password !== confirmPassword) {
      return setValidatePwd(true);
    }
    try {
      setLoading(true);
      // Création de l'utilisateur
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Mis à jour du profil
      await updateProfile(res.user, {
        displayName,
        photoURL: '',
      });
      //Création de l'utilisatreur dans le firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: '',
      });

      //Créer un userChats (discussion de l'utilisateur) vide dans firestore
      await setDoc(doc(db, 'userChats', res.user.uid), {});

      formRegister.current.nom.value = '';
      formRegister.current.mail.value = '';
      formRegister.current.mdpass.value = '';
      formRegister.current.mdpassConfirm.value = '';

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
    } catch (error) {
      setErr(true);
      setLoading(false);

      if (error.code === 'auth/invalid-email') {
        toast.error("L'adresse e-mail fournie n'est pas au format valide!", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (error.code === 'auth/invalid-email') {
        toast.error("L'adresse e-mail fournie n'est pas au format valide!", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Adresse e-mail déjà associée à un compte!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else if (error.code === 'auth/weak-password') {
        toast.error('Le mot de passe fourni est trop faible!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
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
    }
  };

  return (
    <form
      className="d-flex flex-column align-items-center justify-content-center"
      ref={formRegister}
    >
      <div className="mb-3 input-group flex-nowrap">
        <span className="input-group-text">
          <FaUser />
        </span>
        <input
          required
          name="nom"
          type="text"
          className="form-control"
          placeholder="Nom complet"
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
          placeholder="Email"
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
          placeholder="Mot de passe"
        />
      </div>
      <div className="mb-3 input-group flex-nowrap ps-0 form-check">
        <span className="input-group-text">
          <RiLockPasswordFill />
        </span>
        <input
          required
          type="password"
          name="mdpassConfirm"
          className="form-control"
          placeholder="Confirmer votre mot de passe"
        />
      </div>
      {validatePwd && (
        <span className="d-block text-danger">
          Les mots de passe ne correspondent pas!
        </span>
      )}

      <button
        onClick={handleSubmit}
        className="btn d-flex mx-auto  fs-6 btn-lg btn-block text-white log"
        type="button"
      >
        S'inscrire{' '}
        {loading && (
          <ClipLoader color={'#fff'} size={15} className="ms-1 my-auto" />
        )}
      </button>
      <ToastContainer />
    </form>
  );
};
export default Inscription;
