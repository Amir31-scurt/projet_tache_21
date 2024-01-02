import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "../../config/firebase-config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { EmailContext } from "../../contexte/EmailContexte";
import { collection, query, where, getDocs } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

export default function FormConnect() {
  // Les states pour la connexion / login
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Emails d'admin
  const [adminEmails, setAdminEmails] = useState([]);
  // Email de coachs
  const [coachEmails, setCoachEmails] = useState([]);
  // Email des etudiants
  const [studentEmails, setStudentEmails] = useState([]);

  const { email, setEmail } = useContext(EmailContext);

  // UseNavigate pour les redirections
  const navigate = useNavigate();

  // les changements dans les champs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Recuperer les emails de l'admin
  const fetchAdminEmails = async () => {
    const usersRef = collection(db, "utilisateurs");
    const q = query(usersRef, where("role", "==", "Administrateur"));
    const querySnapshot = await getDocs(q);
    const adminEmails = [];

    querySnapshot.forEach((doc) => {
      // Assuming each document has an 'email' field
      adminEmails.push(doc.data().email);
    });

    return adminEmails;
  };
  // Recuperer les emails de coach
  const fetchCoachEmails = async () => {
    const usersRef = collection(db, "utilisateurs");
    const coachQuery = query(usersRef, where("role", "==", "Coach"));
    const querySnapshot = await getDocs(coachQuery);
    const coachEmails = [];

    querySnapshot.forEach((doc) => {
      coachEmails.push(doc.data().email); // Assuming the email field is named 'email'
    });

    return coachEmails;
  };
  // Recuperer les emails des etudiants
  const fetchStudentEmails = async () => {
    const usersRef = collection(db, "utilisateurs");
    const studentQuery = query(usersRef, where("role", "==", "Étudiant"));
    const querySnapshot = await getDocs(studentQuery);
    const studentEmails = [];

    querySnapshot.forEach((doc) => {
      studentEmails.push(doc.data().email); // Assuming the email field is named 'email'
    });

    return studentEmails;
  };

  // Define email lists for different roles
  useEffect(() => {
    const getAdminEmails = async () => {
      const emails = await fetchAdminEmails();
      setAdminEmails(emails);
    };
    const getCoachEmails = async () => {
      const emails = await fetchCoachEmails();
      setCoachEmails(emails);
    };
    const getStudentEmails = async () => {
      const emails = await fetchStudentEmails();
      setStudentEmails(emails);
    };

    getAdminEmails();
    getCoachEmails();
    getStudentEmails();
  }, []);

  // Fonction pour la connexion / login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userEmail = userCredential.user.email;
      const user = userCredential.user;
      localStorage.setItem("userName", user.displayName || "");

      setEmail(userEmail);
      setPassword("");

      // Check if the user is an admin or a coach
      const isAdmin = adminEmails.includes(userEmail);
      const isCoach = coachEmails.includes(userEmail);
      const isStudent = studentEmails.includes(userEmail);
      // Navigate based on the user role
      if (isAdmin) {
        navigate("/dashboard/admin");
      } else if (isCoach) {
        navigate("/dashboard/coach");
      } else if (isStudent) {
        navigate("/dashboard"); // Assuming this is the route for students
      }
    } catch (error) {
      // alert('Échec de la connexion. Veuillez vérifier vos informations.');
      toast.error(
        "Échec de la connexion. Veuillez vérifier vos informations.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="m-5 mb-4">
        <div className="input-group  flex-nowrap">
          <span className="input-group-text" id="addon-wrapping">
            <CiMail />
          </span>
          <input
            type="email"
            class="form-control "
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
      </div>
      <div className=" m-5 ">
        <div className="input-group mb-3  flex-nowrap">
          <span className="input-group-text" id="addon-wrapping">
            <RiLockPasswordFill />
          </span>
          <input
            type="password"
            class="form-control "
            placeholder="Mot de passe"
            value={password}
            onChange={handlePasswordChange}
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        <p
          className="m-0 p-0 text-end oubli"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Mot de passe oublié?
        </p>
        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Mot de pass oublié{" "}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-outline text-start mb-4">
                  <input
                    type="email"
                    id="email"
                    className="form-control p-2"
                    placeholder="Saisissez votre mail"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
          <p className="m-0 p-0 text-end oubli">Mot de passe oublié?</p>
        </div>
        <div className="pt-1 mt-4 text-end">
          <center>
            <button
              type="submit"
              className="btn d-flex justify-content-center align-items-center fs-6 btn-lg btn-block col-7 text-white log"
              disabled={loading}
            >
              {loading ? "Chargement..." : "Se connecter"}
            </button>
          </center>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}
