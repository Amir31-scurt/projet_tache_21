import React, { useState } from "react";
import { quizzes } from "./question";
import 'bootstrap/dist/css/bootstrap.min.css';
import { PiFileHtmlLight } from "react-icons/pi";
// import { IoLogoJavascript } from "react-icons/io";
// import { BsFiletypePhp } from "react-icons/bs";

const ContentBlock = ({ title, content, onClick, icons}) => (
  <div className="content-block" onClick={onClick}>
    <h2>{title}</h2>
    <p>{content}</p>
    <h3></h3>
  </div>
);

const Quiz = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(false));

  const handleAnswerChange = (index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = !newAnswers[index];
    setSelectedAnswers(newAnswers);
  };

  return (
    <div className="espace-tru">
      {questions.map((questionObj, index, id) => (
        <div key={`question-${index}`}>
          <h6 className="paragraph">{questionObj.question}</h6>
          {questionObj.answers.map((answer, answerIndex) => (
            <div key={`answer-${answerIndex}`} className="dig">
              <input
                type="radio"
                checked={selectedAnswers[id]}
                onChange={() => handleAnswerChange(index)}
               id="port"
              />
              <label className="label">{answer}</label>
            </div>
          ))}
        </div>
      ))}
      <div classNme="">
      <button type="button" className="sous">SOUMETTRE</button>
      </div>
    </div>
  );
};

export default function Score() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleContentBlockClick = (index) => {
    setSelectedQuiz(index);
  };

  // Titre des domaines de la programmation
  const lessons = ["Programmation 01: HTML/CSS",
   "Programmation 02: JavaScript",
    "Programmation 03: PHP",
     "Programmation 04: PYTHON"]; 

//contenu du sidebar 
  return (
    <div className="module-container">
      <div className="sidebar">
      <div className="file">
        <h2>Programme</h2>
        {lessons && (
          <>
            {lessons.map((lesson, index) => (
              <div key={`lesson-${index}`} className="lesson-item">
                {lesson}
              </div>
            ))}
          </>
        )}

        <h2>PRACTICE QUIZ</h2>
        {quizzes && (
          <>
          
            {quizzes.map((quiz, index) => (
              <ContentBlock
                key={`quiz-${index}`}
                title={quiz.title}
                icons={quiz.icons}
                content={quiz.description}
                onClick={() => handleContentBlockClick(index)}
              />
            ))}
          </>
        )}
      </div>
      </div>
      <div className="main-content">
        <h1 className="titre">Evaluation (HTML/CSS, JavaScript, PHP, PYTHON)</h1>
        <p className="introduction">Quizzes programmation</p>
        {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} />}
      </div>
    </div>
  );
}
