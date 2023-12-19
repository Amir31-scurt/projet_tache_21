import React from "react";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth, db, storage } from "../firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { doc, setDoc } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";

const Inscription = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo"></span>
        <span className="title"></span>
        <form
        //  onSubmit={handleSubmit}
        >
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            {/* <img src={Add} alt="" /> */}
            <i className="bi bi-card-image"></i>
            <span>Choisir l'image de profil</span>
          </label>
          <button
          //    disabled={loading}
          >
            Sign up
          </button>
          {/* {loading && "Uploading and compressing the image please wait..."} */}
          {/* {err && <span>Something went wrong</span>} */}
        </form>
        <p>
          You do have an account?
          {/* <Link to="/register"> */}
          Login
          {/* </Link> */}
        </p>
      </div>
    </div>
  );
};

export default Inscription;
