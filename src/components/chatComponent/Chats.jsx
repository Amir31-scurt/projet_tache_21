import React, { useContext, useEffect, useState } from "react";
import pp from "../../assets/images/user.png";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { ChatContext } from "../../contexte/ChatContext";
import { AuthContext } from "../../contexte/AuthContext";

export default function Chats() {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  // currentUser?.uid: le '?.' est appelé opérateur de navigation optionnelle"
  // Peut servir à éviter les erreurs de type "cannot read property 'uid' of null" ou "cannot read property 'uid' of undefined".

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          const data = doc.data();
          if (data && typeof data === "object") {
            setChats(data);
          } else {
            // Handle the case where data is not an object
            console.error("Chats data is not an object:", data);
          }
        },
        (error) => {
          // Handle the error case
          console.error("Error fetching chats:", error);
        }
      );
      return () => {
        unsub();
      };
    };
    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser?.uid]);

  // const handleArchived =  (e) => {
  //   // await updateDoc(doc(db, "userChats", ))
  //   console.log(e)
  // }

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  console.log(Object.entries(chats)[1]);
  return (
    <div className="chats d-flex px-2 pt-2">
      {chats
        ? Object.entries(chats)
            ?.sort((a, b) => b[1].date - a[1].date)
            .map(
              (chat) =>
                // {
                chat[1]?.userInfo.uid !== currentUser?.uid && (
                  <div
                    className={`
                      userChat text-center me-2 py-1
                      ${
                        chat[1]?.userInfo?.role === "Coach"
                          ? "coach"
                          : chat[1]?.userInfo?.role === "Administrateutr"
                          ? "admin"
                          : chat[1]?.userInfo?.role === "Étudiant"
                          ? "etudiant"
                          : ""
                      }`}
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1]?.userInfo)}
                  >
                    {/* <i
                      className="bi bi-x-lg position-absolute btnArchived"
                      // onClick={handleArchived}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Archiver"
                    ></i> */}
                    <img
                      src={
                        chat[1]?.userInfo?.photoURL
                          ? "https://firebasestorage.googleapis.com/v0/b/tache21-c134b.appspot.com/o/profile_images%2F4FEGNUHDZOYnv4WvJvyr2TxLha82?alt=media&token=588074b8-639a-42de-bd4b-0199e30150d6"
                          : pp
                      }
                      alt=""
                      className="rounded-circle img-fluid"
                    />

                    <div className="userChatInfo">
                      <span className="text-center fw-bold text-nowrap">
                        {chat[1]?.userInfo.displayName}{" "}
                      </span>
                      <p className="userChatInfolastMessage text-nowrap">
                        {chat[1].lastMessage?.text}{" "}
                      </p>
                    </div>
                  </div>
                )
              // }
            )
        : null}
    </div>
  );
}
