import React from "react";
import { useNavigate } from "react-router-dom";
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
import Restaurer from "./Restaurer";

export default function FormConnect() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);
  const [coachEmails, setCoachEmails] = useState([]);
  const [studentEmails, setStudentEmails] = useState([]);
  const { email, setEmail } = useContext(EmailContext);
  const [showRestaurerModal, setShowRestaurerModal] = useState(false);
  const navigate = useNavigate();

  // Ouvre le modal du composant Restaurer
  const openRestaurerModal = () => {
    setShowRestaurerModal(true);
  };

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
      coachEmails.push(doc.data().email);
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
      studentEmails.push(doc.data().email);
    });

    return studentEmails;
  };

  // Nouvelle fonction pour récupérer les détails de l'utilisateur
  const getUserDetails = async (userEmail) => {
    const usersRef = collection(db, "utilisateurs");
    const userQuery = query(usersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.size === 0) {
      return null; // L'utilisateur n'a pas été trouvé
    }

    return querySnapshot.docs[0].data();
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

      // Récupérer les détails de l'utilisateur
      const userDetails = await getUserDetails(userEmail);

      // Vérifier si l'utilisateur n'existe pas ou est archivé
      if (!userDetails || userDetails.archived) {
        toast.error("Impossible de se connecter. Utilisateur archivé.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        return;
      }

      localStorage.setItem("userName", user.displayName || "");
      setEmail(userEmail);
      setPassword("");

      // Vérifier si l'utilisateur est un admin, un coach ou un étudiant
      const isAdmin = adminEmails.includes(userEmail);
      const isCoach = coachEmails.includes(userEmail);
      const isStudent = studentEmails.includes(userEmail);

      // Rédirectionner en fonction de l'utilisateur connecté
      if (isAdmin) {
        navigate("admin/dashboard");
      } else if (isCoach) {
        navigate("/coach/dashboard");
      } else if (isStudent) {
        navigate("/etudiant/dashboard");
      }
    } catch (error) {
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

  // Affichage
  return (
    <div className="m-0">
      {showRestaurerModal && (
        <Restaurer setShowRestaurerModal={setShowRestaurerModal} />
      )}
      <form onSubmit={handleLogin}>
        <div className="m-5 mb-2">
          <div className="input-group flex-nowrap">
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
        <div className="m-5 ">
          <div className="input-group mb-2 flex-nowrap">
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
      </form>
      <p className="mt-3 mx-5 p-0 text-end fw-bold">
        Mot de passe oublié ?{" "}
        <span className="oubli" onClick={openRestaurerModal}>
          restaurer le ici !
        </span>
      </p>
      <ToastContainer />
    </div>
  );
}
