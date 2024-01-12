import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../../contexte/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase-config";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    if (data && data.chatId) {
      const unsub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
        doc?.exists() && setMessages(doc.data().messages);
        console.log("doc.data() => ");
        console.log(doc.data());
        // console.log("Mes messages", doc.data().messages);
      });

      return () => {
        unsub();
      };
    }
     // eslint-disable-next-line
  }, [data?.chatId]);

  return (
    <div className="messages p-2">
      {messages && messages.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
}
