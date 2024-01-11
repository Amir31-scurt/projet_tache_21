
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { toast } from "react-hot-toast";
import commenter from "../assets/images/commenter.png";
import envoi from "../assets/images/envoi.png";

import React, { useState, useEffect, useContext } from "react";
import userProfile from "../assets/images/userProfile.png";
import { Dialog } from "primereact/dialog";
import "firebase/firestore";
import { AuthContext } from "../contexte/AuthContext";
import { Galleria } from "primereact/galleria";

export default function CardLivraison() {
  // eslint-disable-next-line
  const [currentUser, setCurrentUser] = useState(null);
  // eslint-disable-next-line
  const [userRole, setUserRole] = useState("Rôle inconnu");

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");


  const [visibleComments, setVisibleComments] = useState([]);
  const [hiddenComments, setHiddenComments] = useState([]);
  const navigate = useNavigate();

  const { uid } = useContext(AuthContext);
  const UserUid = uid;
// eslint-disable-next-line
  const [coach, setCoach] = useState("");
  // eslint-disable-next-line
  const [days, setDays] = useState("1");
  // eslint-disable-next-line
  const [role, setRole] = useState("Coach");
  const [date, setDate] = useState("");
  const [apprenant, setApprenat] = useState("");

  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);

  // Fonction pour récupérer les informations de l'étudiant depuis Firestore
  const fetchStudentInfo = async () => {
    try {
      const studentRef = collection(db, "publication");

      // Création de la requête pour récupérer le document de l'étudiant
      const studentQuery = query(studentRef, where("userID", "==", UserUid));
      const studentSnapshot = await getDocs(studentQuery);

      // Vérification s'il y a des documents
      if (!studentSnapshot.empty) {
        const studentData = studentSnapshot.docs[0].data();
        setApprenat(studentData.nom);
        setCoach(studentData.coach);
        setDate(studentData.date);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'étudiant depuis Firestore",
        error
      );
    }
  };

  const fetchImagesFromFirestore = async () => {
    try {
      const publicationRef = collection(db, "publication");
      const q = query(publicationRef);
      const querySnapshot = await getDocs(q);

      const imagesArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        imagesArray.push(...data.images);
      });

      setImages(
        imagesArray.map((url, index) => ({
          itemImageSrc: url,
          thumbnailImageSrc: url,
          alt: `Image ${index + 1}`,
          title: `Title ${index + 1}`,
        }))
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des images depuis Firestore",
        error
      );
    }
  };

  // Fonction pour définir le template d'un item dans le composant Galleria
  const itemTemplate = (item) => (
    <img
      src={item.itemImageSrc}
      alt={item.alt}
      style={{ width: "100%", height: "100%" }}
    />
  );

  // Fonction pour définir le template d'un thumbnail dans le composant Galleria
  const thumbnailTemplate = (item) => (
    <img
      src={item.thumbnailImageSrc}
      alt={item.alt}
      style={{ width: "140px", height: "100px" }}
    />
  );

  // Effet pour récupérer les informations de l'étudiant lors du montage du composant
   // eslint-disable-next-line
  useEffect(() => {
    fetchStudentInfo();
    fetchImagesFromFirestore();
  }, []);
   // eslint-disable-next-line
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "utilisateurs", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const role = userData.role;
            setUserRole(role);
            console.log(role);
          } else {
            console.log(
              "Aucune donnée utilisateur trouvée pour cet utilisateur"
            );
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // * FONCTIONNALITER POUR LES COMMENTAIRES * //
  // Utilisez useEffect pour charger les commentaires dès le chargement du composant
  useEffect(() => {
    fetchComments();
  }, []);

  function handleSend() {
    addComment(); // Appel de la fonction addComment sans publicationId
    toast.success("Commentaire envoyé");
    setComment(""); // Réinitialisation du champ de commentaire après l'envoi
  }

  // Fonction pour supprimer un commentaire
  function deleteComment(commentId) {
    const commentRef = doc(db, "commentaires", commentId);

    deleteDoc(commentRef)
      .then(() => {
        toast.success("Comment deleted successfully");
        fetchComments(); // Mise à jour de l'affichage après la suppression du commentaire
      })
      .catch((error) => {
        console.error("Error deleting comment: ", error);
        toast.error("Erreur lors de la suppression du commentaire");
      });
  }


  useEffect(() => {
    // Séparer les commentaires en deux listes distinctes
    const visible = comments.slice(0, 3); // Les 3 premiers commentaires
    const hidden = comments.slice(3); // Les commentaires restants

    setVisibleComments(visible);
    setHiddenComments(hidden);
  }, [comments]);

  // Ajout d'un commentaire à la base de données
  function addComment() {
    const commentsRef = collection(db, "commentaires");

    addDoc(commentsRef, {
      userName: currentUser ? currentUser.displayName : "Utilisateur inconnu",
      userRole: currentUser ? currentUser.role : "Rôle inconnu",
      commentContent: comment,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("New document created with comment");
        setComment("");
        fetchComments(); // Mise à jour de l'affichage après l'ajout du commentaire
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        toast.error("Erreur lors de la création du document");
      });
  }

  // Fonction pour récupérer et afficher les commentaires depuis Firebase
  function fetchComments() {
    const commentsRef = collection(db, "commentaires");

    onSnapshot(commentsRef, (snapshot) => {
      const commentsData = [];
      snapshot.forEach((doc) => {
        const { userName, userRole } = doc.data();
        commentsData.push({ id: doc.id, userName, userRole, ...doc.data() });
      });

      commentsData.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });

      setComments(commentsData);

      const visible = commentsData.slice(0, 3);
      const hidden = commentsData.slice(3);

      setVisibleComments(visible);
      setHiddenComments(hidden);
    });
  }

  function getTimeDifference(timestamp) {
    if (!timestamp) {
      return ""; // Ou tout autre traitement que vous souhaitez appliquer pour les commentaires sans timestamp
    }

    const currentTime = new Date();
    const commentTime = timestamp.toDate(); // Convertir le timestamp Firestore en objet Date

    const difference = currentTime - commentTime; // Différence en millisecondes

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} jour${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} heure${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} seconde${seconds !== 1 ? "s" : ""} ago`;
    }
  }

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        toast.success("Utilisateur déconnecté avec succès.");
        // Ici tu peux ajouter d'autres actions après la déconnexion si nécessaire
        navigate("/connexion");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  return (
    <div className="">
      <div className="container d-flex justify-content-center flex-wrap containerApprenant my-5">
        <div className="row rowAppenant align-items-center">
          <div className="col-md-12 d-flex colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-2 dark">{apprenant}</h6>
              <p className="m-0 px-3 pt-2 dark">{date}</p>
            </div>
          </div>

          <div className="col-md-12 d-flex justify-content-center py-2">
            <p>Titre de la publication de l'apprenant</p>
          </div>

          {/* Galleria pour afficher les images */}
          <div className="col-12 my-2">
            <Galleria
              value={images}
              numVisible={5}
              style={{ width: "52rem", margin: "auto" }}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              className="publication rounded-2"
            />
          </div>

          <div>
            <Dialog
              className="com flex justify-content-center"
              header="Commentaires"
              visible={visible}
              maximizable
              style={{ width: "50vw" }}
              onHide={() => setVisible(false)}
            >
              {hiddenComments.map((comment) => (
                <div
                  key={comment.id}
                  className="row border rounded-2 m-0 my-2 boxshado"
                >
                  <div className="col-12 py-1">
                    <p className=" d-flex justify-content-between">
                      <span className="">
                        <span className="fw-bolder">{comment.userName}</span>
                        <span className="text-light bg-info rounded-pill px-2 mx-3 pb-0 mainBackgrounColor">
                          {comment.userRole}
                        </span>
                        <span>
                          <span>{getTimeDifference(comment.timestamp)}</span>
                        </span>
                      </span>
                      <span
                        className="supCom"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteComment(comment.id)}
                      >
                        X
                      </span>
                    </p>
                  </div>
                  <div className="col-12">
                    <p>{comment.commentContent}</p>
                  </div>
                </div>
              ))}
            </Dialog>
          </div>

          <div className="col-12 py-1 comment">
            {visibleComments.map((comment) => (
              <div
                key={comment.id}
                className="rowborder rounded-2 m-0 my-2 boxshado"
              >
                <div className="col-12 py-1">
                  <p className=" d-flex justify-content-between">
                    <span className="">
                      <span className="fw-bolder">{comment.userName}</span>
                      <span className="text-light bg-info rounded-pill px-2 mx-3 pb-0 mainBackgrounColor">
                        {comment.userRole}
                      </span>
                      <span>
                        <span>{getTimeDifference(comment.timestamp)}</span>
                      </span>
                    </span>
                    <span
                      className="supCom"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteComment(comment.id)}
                    >
                      X
                    </span>
                  </p>
                </div>
                <div className="col-12">
                  <p>{comment.commentContent}</p>
                </div>
              </div>
            ))}
            <div
              className="comment d-flex align-items-center"
              onClick={() => setVisible(true)}
            >
              <img
                src={commenter}
                alt=""
                className=""
                style={{ width: "30px", height: "30px" }}
              />
              <p className="px-2 m-0 sizeHover" style={{ fontSize: "12px" }}>
                Plus de commentaires
              </p>
            </div>

            <div className="form-floating my-3 rounded-pill boxshadow">
              <input
                className="form-control textarea"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                value={comment} // Liaison de la valeur du champ de commentaire
                onChange={(e) => setComment(e.target.value)} // Gestion des modifications du champ de commentaire
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(); // Appel à la fonction handleSend lorsque la touche "Entrée" est pressée
                  }
                }}
              ></input>
              <label htmlFor="floatingTextarea2">Ajouter un commentaire</label>
              <span className="send" onClick={handleSend}>
                <img
                  src={envoi}
                  alt="send"
                  style={{ width: "30px", height: "30px" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}