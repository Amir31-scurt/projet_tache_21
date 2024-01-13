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
  newDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

import { toast } from "react-hot-toast";
import commenter from "../assets/images/commenter.png";
import envoi from "../assets/images/envoi.png";

import React, { useState, useEffect, useContext } from "react";
import { Dialog } from "primereact/dialog";
import "firebase/firestore";
import { AuthContext } from "../contexte/AuthContext";
import { Galleria } from "primereact/galleria";
import { TiDelete } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

export default function CardLivraison({
  date,
  apprenant,
  titreCourEtudiant,
  images,
  userProfile,
}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("Rôle inconnu");

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [visibleComments, setVisibleComments] = useState([]);
  const [hiddenComments, setHiddenComments] = useState([]);

  const { uid } = useContext(AuthContext);
  const UserUid = uid;
  const [apprenant, setApprenat] = useState("");
  const [coach, setCoach] = useState("");
  const [date, setDate] = useState("");
  const [days, setDays] = useState("1");
  const [role, setRole] = useState("Coach");

  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);

  // Fonction pour extraire les données d'images à partir des URLs
  const fetchImagesFromProps = (images) => {
    // Mapper sur les URLs des images pour créer un tableau d'objets
    const imagesData = images.map((url, index) => ({
      itemImageSrc: url,
      thumbnailImageSrc: url,
      alt: `Image ${index + 1}`,
      title: `Titre ${index + 1}`,
    }));

    // Mettre à jour l'état local avec les données d'images
    setImages(imagesData);
  };

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
        setDate(format(studentData.date.toDate(), "dd/MM/yyyy - HH:mm:ss"));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de l'étudiant depuis Firestore",
        error
      );
    }
  };

  // Effet de chargement initial et chaque fois que les images changent
  useEffect(() => {
    //extraire les données d'images à partir des images actuelles
    fetchImagesFromProps(images);
  }, [images]);

  // Fonction de rendu pour un élément individuel dans la galerie d'images
  const itemTemplate = (item) => (
    <img
      src={item.itemImageSrc}
      alt={item.alt}
      style={{ width: "100%", height: "100%" }}
    />
  );

  // Fonction de rendu pour une miniature dans la galerie d'images
  const thumbnailTemplate = (item) => (
    <img
      src={item.thumbnailImageSrc}
      alt={item.alt}
      style={{ width: "140px", height: "100px" }}
    />
  );

  // Effet pour récupérer les informations de l'étudiant lors du montage du composant
  useEffect(() => {
    fetchStudentInfo();
    fetchImagesFromFirestore();
    fetchComments();
  }, []);

  useEffect(() => {
    const unsubscribeUser = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, "utilisateurs", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("userData:", userData);
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

    const unsubscribeComments = onSnapshot(
      collection(db, "commentaires"),
      (snapshot) => {
        const commentsData = [];
        snapshot.forEach((doc) => {
          const { userName, userID } = doc.data();
          // Ajoutez ici la logique pour filtrer les commentaires par utilisateur si nécessaire
          // par exemple, vous pourriez vérifier si userID correspond à l'utilisateur actuel
          commentsData.push({
            id: doc.id,
            userName,
            userID,
            ...doc.data(),
          });
        });

        commentsData.sort((a, b) => b.timestamp - a.timestamp);

        setComments(commentsData);

        const visible = commentsData.slice(0, 3);
        const hidden = commentsData.slice(3);

        setVisibleComments(visible);
        setHiddenComments(hidden);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeComments();
    };
  }, []);

  // Ajout de la fonction fetchComments
  function fetchComments() {
    const commentsRef = collection(db, "commentaires");

    onSnapshot(commentsRef, (snapshot) => {
      const commentsData = [];
      snapshot.forEach((doc) => {
        const { userName, userID } = doc.data();
        commentsData.push({
          id: doc.id,
          userName,
          userID,
          ...doc.data(),
        });
      });

      commentsData.sort((a, b) => b.timestamp - a.timestamp);

      setComments(commentsData);

      const visible = commentsData.slice(0, 3);
      const hidden = commentsData.slice(3);

      setVisibleComments(visible);
      setHiddenComments(hidden);
    });
  }

  function handleSend() {
    addComment(); // Appel de la fonction addComment sans publicationId
    toast.success("Commentaire envoyé");
    setComment(""); // Réinitialisation du champ de commentaire après l'envoi
    fetchComments(); // Ajoutez cet appel pour mettre à jour les commentaires après l'ajout
  }

  // Fonction pour supprimer un commentaire
  function deleteComment(commentId) {
    const commentRef = doc(db, "commentaires", commentId);

    deleteDoc(commentRef)
      .then(() => {
        toast.success("Commentaire supprimer");
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
      userID: currentUser.uid,
      userName: currentUser.displayName || "Utilisateur inconnu",
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
      return `il y a ${days} jour${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `il y a ${seconds} seconde${seconds !== 1 ? "s" : ""}`;
    }
  }

  return (
    <div className="">
      <div className="container d-flex justify-content-center flex-wrap containerApprenant my-5">
        <div className="row rowAppenant align-items-center">
          <div className="col-md-12 d-flex colApprenant my-3">
            <img src={userProfile} alt="" className="icon" />
            <div className="mySpan">
              <h6 className=" px-3 pt-1 fs-5 fst-italic dark">{apprenant}</h6>
              <p className="m-0 fst-italic px-3 pt-1 dark">{date}</p>
            </div>
          </div>

          <div className="col-md-12 d-flex justify-content-center  fst-italic fw-bold fs-6 py-2">
            <p>{titreCourEtudiant}</p>
          </div>

          {/* Galleria pour afficher les images */}
          <div className="col-12 my-1">
            <Galleria
              value={imagesData}
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
                          role
                        </span>
                        <span>
                          <span>{getTimeDifference(comment.timestamp)}</span>
                        </span>
                      </span>
                      <span
                        className="supCom"
                        style={{ cursor: "pointer" }}
                        // onClick={() => deleteComment(comment.id)}
                      >
                        {comment.userID === currentUser.uid && (
                          <TiDelete
                            className="delete"
                            style={{
                              cursor: "pointer",
                              width: "20px",
                              height: "20px",
                            }}
                            onClick={() => deleteComment(comment.id)}
                          />
                        )}
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
                className="row border rounded-2 m-0 my-2 boxshado"
              >
                <div className="col-12 py-1">
                  <p className=" d-flex justify-content-between">
                    <span className="">
                      <span className="fw-bolder">{comment.userName}</span>
                      <span className="text-light bg-info rounded-pill px-2 mx-3 pb-0 mainBackgrounColor">
                        {/* {comment.userRole} */}
                      </span>
                      <span>
                        <span>{getTimeDifference(comment.timestamp)}</span>
                      </span>
                    </span>
                    <span
                      className="supCom"
                      style={{ cursor: "pointer" }}
                      // onClick={() => deleteComment(comment.id)}
                    >
                      {comment.userID === currentUser.uid && (
                        <TiDelete
                          className="delete"
                          style={{
                            cursor: "pointer",
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={() => deleteComment(comment.id)}
                        />
                      )}
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
                style={{ cursor: "pointer", width: "30px", height: "30px" }}
              />
              <p className="m-0 sizeHover" style={{ fontSize: "12px" }}>
                <span className="px-2">voir plus</span>
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
