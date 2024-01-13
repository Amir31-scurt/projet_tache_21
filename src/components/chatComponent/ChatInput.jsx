import React, { useContext, useState } from "react";
import { ChatAuthCtx } from "../../contexte/ChatAuthCtx";
import { ChatContext } from "../../contexte/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { v4 as uuidv4 } from "uuid";

export default function ChatInput({ activeBtn }) {
  console.log(activeBtn);
  const [text, setText] = useState();
  const [jourSemaine, setJourSemaine] = useState("");
  const [date, setDate] = useState("");
  const [mois, setMois] = useState("");
  const [heures, setHeures] = useState("");
  const [minutes, setMinutes] = useState("");

  const { currentUser } = useContext(ChatAuthCtx);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text !== "") {
      const myDate = new Date();
      const moisAnnee = [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Aout",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const joursSemaine = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
      setJourSemaine(joursSemaine[myDate.getDay()]);
      setDate(myDate.getDate());
      setMois(moisAnnee[myDate.getMonth()]);
      setHeures(myDate.getHours());
      setMinutes(myDate.getMinutes());

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          jour: jourSemaine + " " + date + " " + mois,
          heures: heures + ":" + minutes,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      setText("");
    }
  };

  const handleKeyEnter = (e) => {
    !activeBtn && e.code === "Enter" && handleSend();
  };

  return (
    <div className="chatInput d-flex p-1">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-control rounded-pill me-1"
        placeholder="Envoyer.."
        onKeyDown={handleKeyEnter}
      />
      {/* <div className="send bg-danger"> */}
      <button
        className="btn text-white rounded-circle"
        onClick={handleSend}
        disabled={activeBtn}
      >
        <i class="bi bi-send-fill"></i>
      </button>
      {/* </div> */}
    </div>
  );
}
