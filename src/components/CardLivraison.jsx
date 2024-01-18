import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

import { toast } from "react-hot-toast";
import commenter from "../assets/images/commenter.png";
import envoi from "../assets/images/envoi.png";

import React, { useState, useEffect, useContext } from "react";
import { Dialog } from "primereact/dialog";
import "firebase/firestore";
import { AuthContext } from "../contexte/AuthContext";
import { Galleria } from "primereact/galleria";
import { MdOutlineDelete } from "react-icons/md";
import { FaCircleXmark } from "react-icons/fa6";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiAlertTriangle, FiEdit3 } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";

export default function CardLivraison({
  date,
  apprenant,
  titreCourEtudiant,
  images,
  userProfile,
  descriptLivraison,
  UserID,
  handleDeleteLivraison,
  livraison,
  handleUpdateDescription,
}) {
  // const [userRole, setUserRole] = useState("Rôle inconnu");
  const [NameUser, setNameUser] = useState("");
  const [imagesData, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [visibleComments, setVisibleComments] = useState([]);
  const [hiddenComments, setHiddenComments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [livraisonToDelete, setLivraisonToDelete] = useState(null);

  const { uid } = useContext(AuthContext);
  const UserUid = uid;

  const navigate = useNavigate();

  const handleDelete = (livraisonId) => {
    handleDeleteLivraison(livraisonId);
  };

  // Fonction pour extraire les données d'images à partir des URLs
  const fetchImagesFromProps = (images) => {
    const imagesData = images.map((url, index) => ({
      itemImageSrc: url,
      thumbnailImageSrc: url,
      alt: `Image ${index + 1}`,
      title: `Titre ${index + 1}`,
    }));

    // Mettre à jour l'état local avec les données d'images
    setImages(imagesData);
  };

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
      style={{ width: "100%", height: "100px" }}
    />
  );

  // * FONCTIONNALITER POUR LES COMMENTAIRES * //
  // Utilisez useEffect pour charger les commentaires dès le chargement du composant
  useEffect(() => {
    fetchComments();
  }, []);

  function handleSend() {
    addComment(); // Appel de la fonction addComment sans publicationId
    toast.success("Commentaire envoyé");
    setComment(""); // Réinitialisation du champ de commentaire après l'envoi
    fetchComments(livraison.key); // Ajouter l'identifiant de la livraison lors de l'appel
  }

  // Fonction pour supprimer un commentaire
  function deleteComment(commentId) {
    const commentRef = doc(db, "commentaires", commentId);

    deleteDoc(commentRef)
      .then(() => {
        toast.success("Commentaire supprimé");
        // Mettre à jour l'état des commentaires en excluant le commentaire supprimé
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId)
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du commentaire : ", error);
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

  // FONCTION RECUPERATION ROLE
  const [roleUser, setRoleUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollectionRef = collection(db, "utilisateurs");
        const q = query(usersCollectionRef, where("userId", "==", UserUid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Il y a au moins un document correspondant à UserUid
          const userData = querySnapshot.docs[0].data();
          setNameUser(userData.name);
          const studentRole = userData.role;
          setRoleUser(studentRole);
        } else {
          console.log("Le user ID n'existe pas :", UserUid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [UserUid]);

  // Ajout d'un commentaire à la base de données
  function addComment() {
    const commentsRef = collection(db, "commentaires");

    addDoc(commentsRef, {
      userID: UserUid,
      userName: NameUser || "Utilisateur inconnu",
      userRole: roleUser,
      commentContent: comment,
      livraisonId: livraison.key, // Ajouter l'identifiant de la livraison au commentaire
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log("New document created with comment");
        setComment("");
        fetchComments(livraison.key); // Utiliser l'identifiant de la livraison lors de la récupération des commentaires
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        toast.error("Erreur lors de la création du document");
      });
  }

  // Fonction pour récupérer et afficher les commentaires depuis Firebase
  function fetchComments(livraisonId) {
    const commentsRef = collection(db, "commentaires");

    // Utilisez onSnapshot pour écouter les changements dans la collection
    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const commentsData = [];
      snapshot.forEach((doc) => {
        const {
          userName,
          userID,
          livraisonId: commentLivraisonId,
        } = doc.data();
        // Filtrer les commentaires uniquement en fonction de livraisonId
        if (commentLivraisonId === livraisonId) {
          commentsData.push({
            id: doc.id,
            userName,
            userID,
            ...doc.data(),
          });
        }
      });

      commentsData.sort((a, b) => b.timestamp - a.timestamp);

      // Mettre à jour les variables d'état spécifiques à la carte
      setComments(commentsData);

      const visible = commentsData.slice(0, 3);
      const hidden = commentsData.slice(3);

      setVisibleComments(visible);
      setHiddenComments(hidden);
    });

    // Retournez la fonction unsubscribe pour arrêter d'écouter lors du démontage du composant
    return unsubscribe;
  }

  useEffect(() => {
    // Appeler la fonction fetchComments avec l'identifiant de la livraison
    const unsubscribe = fetchComments(livraison.key);

    // Assurez-vous de vous désabonner lors du démontage du composant
    return () => unsubscribe();
  }, [livraison.key]); // Ajouter livraison.key à la liste de dépendances

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

  const [hovered, setHovered] = useState(false);
  const [newDescription, setNewDescription] = useState(descriptLivraison);
  const [originalDescription, setOriginalDescription] =
    useState(descriptLivraison);
  const [editStart, setEditStart] = useState(false);
  const handleEditing = () => {
    setEditStart(true);
    setOriginalDescription(newDescription);
  };

  const handleCancelEditing = () => {
    // Restaurer la description à partir de l'état local
    setNewDescription(originalDescription);
    setEditStart(false);
  };

  // Fonction pour mettre à jour la description
  const handleUpdate = () => {
    // Appeler la fonction de mise à jour avec le nouvel état de la description
    handleUpdateDescription(livraison.key, newDescription);
    setEditStart(false); // Désactiver le mode édition
  };

  return (
    <div className="">
      <div className="container d-flex justify-content-center flex-wrap containerApprenant my-5">
        <div className="row rowAppenant align-items-center">
          <div className="col-md-12 d-flex justify-content-between">
            <div className=" d-flex colApprenant my-3">
              <img
                src={userProfile}
                alt="user-Profile"
                style={{
                  width: "58px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div className="mySpan">
                <h6 className=" px-3 pt-1 fs-5 fst-italic dark">{apprenant}</h6>
                <p className="m-0 fst-italic px-3 pt-1 dark">{date}</p>
              </div>
            </div>

            {UserUid === UserID && (
              <div
                className="d-flex justify-content-end align-items-center"
                style={{ width: "20%" }}
              >
                <button
                  className="bg-transparent"
                  onClick={() => {
                    setLivraisonToDelete(livraison.key);
                    setConfirmDialogVisible(true);
                  }}
                >
                  <MdOutlineDelete style={{ color: "red", fontSize: "30px" }} />
                </button>
              </div>
            )}
          </div>

          <div className="col-md-12 d-flex justify-content-center  fst-italic fw-bold fs-6 py-2">
            <p>{titreCourEtudiant}</p>
          </div>

          {/* Galleria pour afficher les images */}
          <div className="col-12 my-1">
            <Galleria
              value={imagesData}
              numVisible={5}
              style={{ width: "100%", margin: "auto" }}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              className="publication rounded-2"
            />
          </div>

          <div style={{ width: "90%", margin: "auto" }}>
            <div
              className={` d-flex ${
                editStart ? "d-block " : "d-none"
              } justify-content-center`}
            >
              <textarea
                className="AreaModifDesc"
                name="area"
                id="ModifArea"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              ></textarea>

              <div className="d-flex flex-column ">
                <button
                  className="cancelBtnModif"
                  onClick={handleCancelEditing}
                >
                  <FaCircleXmark className="text-danger fs-1" />
                </button>
                <button
                  className="SaveBtnModif p-2"
                  onClick={() => {
                    handleUpdate();
                    toast.success("Modification Reussie !", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    });
                  }}
                >
                  <BsFillCheckCircleFill className="fs-1" />
                </button>
              </div>
            </div>
            <div
              className="d-flex justify-content-center align-items-center pb-2"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <h3
                  style={{ lineHeight: "22px" }}
                  className={`${
                    editStart ? "d-none " : "d-block"
                  } text-center px-6 fst-italic fw-light text-secondary fs-6 text-break my-1`}
                >
                  {newDescription}
                </h3>
              </div>
              {UserUid === UserID && (
                <div className={` ${hovered ? "d-block" : "d-none"} ms-6`}>
                  <button
                    className={`${
                      editStart ? "d-none " : "d-block"
                    } bg-transparent`}
                    onClick={handleEditing}
                  >
                    <FiEdit3 className="fs-4" style={{ color: "#3084b5" }} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="MargeLivraison"></div>

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
                        // onClick={() => deleteComment(comment.id)}
                      >
                        {comment.userID === UserUid && (
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
                        {comment.userRole}
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
                      {comment.userID === UserUid && (
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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
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

      <Dialog
        header={
          <h3 className="fst-italic" style={{ color: "#3086d8" }}>
            Confirmation <FiAlertTriangle className="fs-1 text-danger pb-2" />
          </h3>
        }
        visible={confirmDialogVisible}
        style={{ width: "auto", textAlign: "center" }}
        onHide={() => setConfirmDialogVisible(false)}
      >
        <div className="">
          {/*  */}
          <p className="fst-italic pb-4 text-danger fw-bold px-3">
            Êtes-vous sûr de vouloir supprimer cette livraison ?
          </p>
          <div className="">
            <button
              className="btn btn-danger px-4 fst-italic me-3"
              onClick={() => {
                handleDelete(livraisonToDelete);
                setConfirmDialogVisible(false);
              }}
            >
              Oui
            </button>
            <button
              className="btn  px-4 fst-italic  text-white "
              style={{ backgroundColor: "#3086d8" }}
              onClick={() => setConfirmDialogVisible(false)}
            >
              Non
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
