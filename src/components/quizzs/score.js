import React from "react";

const ContentBlock = ({ title, content }) => (
  <div className="content-block">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

export default function Score({ lessons, quizzes }) {
  return (
    <div className="module-container">
      <div className="sidebar">
        <h2>Change Simplification</h2>
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
              <div key={`quiz-${index}`} className="lesson-item">
                {quiz}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="main-content">
    <h1>Evaluatuion(HTML/CSS, JavaScript, REACT, LARAVEL) </h1>
    <p className="introduction">Quizs programmation</p>
    <ContentBlock title="HTML/CSS" content="Testez votre niveau en HTML/CSS" />
    <ContentBlock title="JavaScript" content="Testez votre niveau en JavaScript" />
    <ContentBlock title="React JS" content="Testez votre niveau en React JS" />
    <ContentBlock title="Laravel" content="Testez votre niveau en LARAVEL" />
    {/* ... other content blocks */}
  </div>
  </div>
  );
}



