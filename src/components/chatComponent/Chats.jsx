import React, { useContext, useEffect, useState } from "react";
import pp from "../../assets/images/user.png";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { ChatContext } from "../../contexte/ChatContext";

export default function Chats() {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(ChatAuthCtx);
  const { dispatch } = useContext(ChatContext);
  // currentUser?.uid: le '?.' est appelé opérateur de navigation optionnelle"
  // Peut servir à éviter les erreurs de type "cannot read property 'uid' of null" ou "cannot read property 'uid' of undefined".

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          setChats(doc.data());

          console.log(
            "Afficher les userChats depuis le composant Chats",
            chats
          );
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  console.log(
    "Afficher les userChats depuis le composant Chats, essaie 3",
    chats
  );
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
                    className="userChat text-center me-2"
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1]?.userInfo)}
                  >
                    <img src={pp} alt="" className="" />
                    <div className="userChatInfo">
                      <span className="text-center text-nowrap">
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
