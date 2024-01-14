import React, { useContext, useEffect, useState } from "react";
import pp from "../../assets/images/user.png";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../../config/firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function Search({ openSearch }) {
  // Définir les etats
  const [userName, setUserName] = useState(); // L'user qu'on cherche
  const [user, setUser] = useState(null); // L'user trouvé
  const [err, setErr] = useState(false); // Gestion de des erreurs éventuelles
  const [searchResult, setSearchResult] = useState();
  const [closeSearch, setCloseSearch] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userAuthImgPP, setUserAuthImgPP] = useState(null);
  // Récupérer le contexte
  const { currentUser } = useContext(ChatAuthCtx);

  // _______Récupération du PP de l'user authentifé_________
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        const storageRef = ref(storage, `profile_images/${userAuth.uid}`);
        getDownloadURL(storageRef)
          .then((url) => {
            setUserAuthImgPP(url);
          })
          .catch((error) => {
            console.error("Error loading profile image:", error.message);
          });
      }
    });

    return () => unsubscribe();
  }, []);
  // ________________________________________________________

  // Définir la fonction handleSearch
  const handleSearch = async () => {
    // Définir la requette
    const q = query(
      collection(db, "utilisateurs"),
      where("name", "==", userName)
    );
    // Gestion de la réponse
    try {
      const querySnapchot = await getDocs(q);
      querySnapchot.forEach(async (doc) => {
        setUser((prevUser) => ({ ...prevUser, ...doc.data() }));
        // ___________________________
        // Récupérer l'URL de l'image de profil
        const storageRef = ref(storage, `profile_images/${doc.data().userId}`);
        try {
          const url = await getDownloadURL(storageRef);
          setProfileImage(url);
        } catch (error) {
          console.error("Error loading profile image:", error.message);
          setProfileImage(null);
        }
        // ________________________________
      });
      const resultat = user === null;
      setSearchResult(resultat);
    } catch (err) {
      setErr(true);
    }
  };

  // Définir la fonction permet de cliquer sur "Entrer" pour lancer la requette
  const handleKeyEnter = (e) => {
    e.code === "Enter" && handleSearch();
  };

  // Définir la fonction qui permet de sélectionner le compte rechercher
  const handleSelect = async () => {
    setCloseSearch(true);
    // Combinaison d'identifiant
    const combinedId =
      currentUser.uid > user.userId
        ? currentUser.uid + user.userId
        : user.userId + currentUser.uid;
    try {
      // Récupérer le chat existant (évetuellement) entre les user du  combinedId
      const res = await getDoc(doc(db, "chats", combinedId));

      // Si le chat n'existe pas, on le cré
      if (!res.exists()) {
        // Créer le chat dans la collection chats
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // const storageRef = ref(storage, `profile_images/${user.userId}`);

        // if (storageRef.exists()) {
        //   await getDownloadURL(storageRef).then(async (download) => {
        //     try {
        //       console.log(
        //         "Je teste au niveau du getDownloadURL du composant Search la pp de Mass: ",
        //         download
        //       );
        // Mise à jour d userChats (Contenant des infos élémentaires du chat d'1 user avk 1autre)
        // await updateDoc(doc(db, "userChats", currentUser.uid), {
        //   [combinedId + ".userInfo"]: {
        //     uid: user.userId,
        //     displayName: user.name,
        //     role: user.role,
        //     archived: false,
        //     photoURL: download,
        //   },
        //   [combinedId + ".date"]: serverTimestamp(),
        // });
        //     } catch (error) {
        //       console.log(error);
        //     }
        //   });
        // } else {
        // Mise à jour d userChats (Contenant des infos élémentaires du chat d'1 user avk 1autre)
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.userId,
            displayName: user.name,
            role: user.role,
            archived: false,
            photoURL: profileImage,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        // }

        await updateDoc(doc(db, "userChats", user.userId), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: userAuthImgPP,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    // Vider l'input et le résultat de la recherche
    setUserName("");
    setUser(null);
  };
  return (
    <div className={`search ${(openSearch || closeSearch) && "searchHidden"}`}>
      <div className="searchForm ">
        <div
          className="input-group d-flex align-items-center p-2"
          id="navbar-input-container"
        >
          <i
            className="bi bi-search fw-bold my-auto "
            onClick={handleSearch}
            id="searchFormBtn"
          ></i>
          <input
            type="text"
            className="form-control border-0"
            placeholder="Chercher un compte..."
            autoFocus
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKeyEnter}
          />
        </div>
      </div>
      {user ? (
        <div className="d-flex p-2 userChatContainer" onClick={handleSelect}>
          <div className="userChat">
            <img
              src={profileImage ? profileImage : pp}
              alt=""
              className="d-block mx-auto imgFind rounded-circle"
            />
            <div className="userChatInfo">
              <span className="userChatInfoName">{user.name}</span>
            </div>
          </div>
        </div>
      ) : (
        userName && (
          <span className="text-danger ms-2 fs-6 pb-2">
            Pas de résultat(s) ...
          </span>
        )
      )}
    </div>
  );
}
