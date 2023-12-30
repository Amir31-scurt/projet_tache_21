import React, { useState } from "react";
import { quizzes } from "./question";
import 'bootstrap/dist/css/bootstrap.min.css';

const ContentBlock = ({ title, content, onClick, icons }) => (
  <div className="content-block" onClick={onClick}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

const Quiz = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(false));

  const handleAnswerChange = (index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[index] = !newAnswers[index];
    setSelectedAnswers(newAnswers);
  };
  const titres = ["Titre 1"];

  return (
    <div className="espace-tru">
          {titres.map((titre, index) => (
        <h1 key={index}>{titre}</h1>
      ))}
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
                style={{ backgroundColor: selectedAnswers[id] }}
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
  const lessons = ["Programmation 01: Management International",
    "Programmation 02: Gestion interculturelle",
    "Programmation 03: Commerce International",
    "Programmation 04: Gestions des Affaires Internationales "];

  //contenu du sidebar 
  return (
    <div className="module-container">
      <div className=" col-md-3 sidebar">
        <div className="file">
          <h2 className="text-center">Programme</h2>
          {lessons && (
            <>
              {lessons.map((lesson, index) => (
                <div key={`lesson-${index}`} className="lesson-item">
                  {lesson}
                </div>
              ))}
            </>
          )}

          <h2 className="text-center">PRACTICE QUIZ</h2>
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
      <div className=" col-md-9 main-content">
        {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} />}
      </div>
    </div>
  );
}