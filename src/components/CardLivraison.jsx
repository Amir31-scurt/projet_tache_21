import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { toast } from "react-hot-toast";

import userProfile from "../assets/images/user.png";
import commenter from "../assets/images/commenter.png";
import envoi from "../assets/images/envoi.png";
import img1 from "../assets/images/img (1).jpg";
import img2 from "../assets/images/img (2).jpg";
import img3 from "../assets/images/img (3).jpg";
import img4 from "../assets/images/img (4).jpg";
import img5 from "../assets/images/img (5).jpg";

import { Dialog } from "primereact/dialog";
import { Galleria } from "primereact/galleria";

export default function CardLivraison() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("Rôle inconnu");
  const [apprenant, setApprenat] = useState("Cheikh Ahmed Tidiane Gueye");
  const [date, setDate] = useState("19 Dec 2023, 16:05");

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // const [role, setRole] = useState("Coach");
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState(null);

  const [visibleComments, setVisibleComments] = useState([]);
  const [hiddenComments, setHiddenComments] = useState([]);
  const navigate = useNavigate();

  const PhotoService = {
    getData() {
      return [
        {
          itemImageSrc: img1,
          thumbnailImageSrc: img1,
          alt: 'Description for Image 1',
          title: 'Title 1',
        },
        {
          itemImageSrc: img2,
          thumbnailImageSrc: img2,
          alt: 'Description for Image 2',
          title: 'Title 2',
        },
        {
          itemImageSrc: img3,
          thumbnailImageSrc: img3,
          alt: 'Description for Image 3',
          title: 'Title 3',
        },
        {
          itemImageSrc: img4,
          thumbnailImageSrc: img4,
          alt: 'Description for Image 4',
          title: 'Title 4',
        },
        {
          itemImageSrc: img5,
          thumbnailImageSrc: img5,
          alt: 'Description for Image 5',
          title: 'Title 5',
        },
      ];
    },

    getImages() {
      return Promise.resolve(this.getData());
    },
  };

  const itemTemplate = (item) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        className='w-100'
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img src={item.thumbnailImageSrc} alt={item.alt} className="w-100" />
    );
  };

  useEffect(() => {
    PhotoService.getImages().then((data) => setImages(data));
  }, []);

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
    PhotoService.getImages().then((data) => setImages(data));
  }, []);

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

          <div className="col-12 my-2 ">
            <Galleria
              value={images}
              numVisible={5}
              style={{ maxWidth: "" }}
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