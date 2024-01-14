import React, { useContext, useEffect, useRef, useState } from "react";
import pp from "../../assets/images/user.png";
// import messageTexto from "../../assets/images/affiche.jpg";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";
import { ChatContext } from "../../contexte/ChatContext";

export default function Message({ message }) {
  const { currentUser } = useContext(ChatAuthCtx);
  const { data } = useContext(ChatContext);

  const [userAuthImgPP, setUserAuthImgPP] = useState(null);

  const mess = useRef();

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

  useEffect(() => {
    // Faire scroller vers le bas à chaq nouveau message
    mess.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={mess}
      className={`message my-3 d-flex ${
        message ? message?.senderId !== currentUser?.uid && "owner" : ""
      }`}
    >
      <div className="messageInfo d-flex flex-column">
        <img
          src={
            message && message?.senderId !== currentUser?.uid
              ? userAuthImgPP
              : data?.user?.photoURL
          }
          alt=""
        />
        <img src={pp} alt="" />
      </div>
      <div className="messageContent">
        <span className="text-dark">{message?.jour}</span>
        <p className="bg-primary text-white text-wrap px-2 pt-2 pb-3">
          {message?.text}
          <span className="">{message?.heures}</span>
        </p>
        {/* <img src={messageTexto} alt="" /> */}
      </div>
    </div>
  );
}
