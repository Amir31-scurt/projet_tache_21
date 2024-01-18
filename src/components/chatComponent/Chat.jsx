import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import Messages from './Messages';
import { ChatContext } from '../../contexte/ChatContext';
import { FaCrown } from 'react-icons/fa';
import { FaGraduationCap } from 'react-icons/fa6';
import { FaChalkboardTeacher } from 'react-icons/fa';

export default function Chat() {
  const { data } = useContext(ChatContext);
  const correspondant = useRef(null);
  const [activedBtn, setActivedBtn] = useState(true);

  useEffect(() => {
    correspondant.current &&
      correspondant.current?.innerText !== '' &&
      setActivedBtn(false);
  }, [data.user]);
  console.log('Contenu data du composant Chat 5', data);
  return (
    <div className="chat">
      <div className="chatInfo p-1">
        <div className="d-flex justify-content-between text-white">
          <span className="fst-italic" ref={correspondant}>
            <i className="bi bi-chat ms-2 me-3"></i>
            {data.user?.displayName}{' '}
          </span>
          {data.user?.role === 'Administrateur' ? (
            <FaCrown className="my-auto me-2" id="crown" />
          ) : data.user?.role === 'Coach' ? (
            <FaChalkboardTeacher className="my-auto me-2" id="teacher" />
          ) : data.user?.role === 'Étudiant' ? (
            <FaGraduationCap className="my-auto me-2" />
          ) : (
            ''
          )}
        </div>
      </div>
      <Messages />
      <ChatInput activeBtn={activedBtn} />
    </div>
  );
}
