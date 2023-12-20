import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";
// import affiche from "../assets/images/affiche.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth, db, storage } from "../config/firebase-config";
import { useNavigate } from "react-router";

const Inscription = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  // const [actived, setActived] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Récupération des informations entrées par l'utilisateur
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    // const confirmPassword = e.target[3].value;
    const file = e.target[3].value;
    console.log(displayName, file, email, password);

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
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //Créer un userChats (discussion de l'utilisateur) vide dans firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});

            // On navigue
            navigate("/dashboardapprenant");
          } catch (err) {
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <form className="justify-content-center" onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          // required
          type="text"
          className="form-control"
          placeholder="display name"
        />
      </div>
      <div className="mb-3">
        <input
          // required
          type="email"
          className="form-control"
          placeholder="email"
        />
      </div>
      <div className="mb-3 ps-0 form-check">
        <input
          // required
          type="password"
          className="form-control"
          placeholder="password"
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
      <div className="mb-3 ps-0 form-check">
        <input
          // required
          style={{ display: "none" }}
          type="file"
          id="file"
        />
        <label htmlFor="file">
          {/* <img src={Add} alt="" /> */}
          <i className="bi bi-card-image me-3"></i>
          <span>Choisir l'image de profil</span>
        </label>
      </div>
      <center>
          <button class="btn  d-flex justify-content-center align-items-center fs-6 btn-lg btn-block text-white  log" type="button">S'inscrire</button>
          </center>
      {/* <button type="submit" className="btn btn-primary" disabled={loading}>
        Sign In
      </button> */}
      {err && <span style={{ color: "red" }}>Quelque chose d'anormale</span>}
    </form>
  );
};
export default Inscription;
