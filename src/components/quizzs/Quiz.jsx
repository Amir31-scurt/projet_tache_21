import React, { useState } from 'react';

const Quiz = ({ quizData }) => {
  const { questions, correctAnswers } = quizData;

  const [userAnswers, setUserAnswers] = useState(Array(correctAnswers.length).fill(''));
  const [score, setScore] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        newScore += 1;
      }
    });
    setScore(newScore);

    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement, index) => {
      if (userAnswers[index] === correctAnswers[index]) {
        questionElement.classList.add('correct');
      } else {
        questionElement.classList.add('wrong');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOptionChange = (indexQuestion, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[indexQuestion] = value;
    setUserAnswers(newAnswers);

    const isValid = newAnswers.every(answer => answer !== '');
    setIsFormValid(isValid);
  };

  const handleRetry = () => {
    setUserAnswers(Array(correctAnswers.length).fill(''));
    setScore(null);

    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement) => {
      questionElement.classList.remove('correct', 'wrong');
    });
  };

  return (
    <main>
      <section className="quiz">
        <div className="heading">
          <p className="title">Quiz</p>
        </div>

        {score !== null && (
          <div className="result">
            <p>{`Vous avez obtenu ${score}/${correctAnswers.length}!`}</p>
            <p className="reload">
              <button onClick={handleRetry}>Réessayer ?</button>
            </p>
          </div>
        )}

        <form className="quiz-form" onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={index} className="question">
              <p className='fw-bolder fs-5'>{`${index + 1}. ${q.question}`}</p>
              {q.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`option ${score !== null ? (userAnswers[index] === option ? (userAnswers[index] === correctAnswers[index] ? 'correct' : 'wrong') : '') : ''}`}
                >
                  <input
                    type="radio"
                    id={`q${index + 1}${optionIndex}`}
                    name={`q${index + 1}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    className="module"
                  /> &nbsp;
                  <label htmlFor={`q${index + 1}${optionIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <div className="submit">
            <button className="btn btn-success" type="submit" disabled={!isFormValid}>
              Soumettre
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Quiz;
