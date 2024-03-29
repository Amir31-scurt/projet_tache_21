import React, { useState, useContext, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../../contexte/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/quizz.css';

const Quiz = ({ quizData }) => {
  const { questions, correctAnswers } = quizData;
  const authContext = useContext(AuthContext);

  const [userAnswers, setUserAnswers] = useState(Array(correctAnswers.length).fill(''));
  const [score, setScore] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  useEffect(() => {
    const studentName = authContext.currentUser.displayName;

    const checkRemainingAttempts = async () => {
      try {
        const resultsQuery = query(collection(db, 'scorequizz'), where('NomEtudiant', '==', studentName));
        const resultsSnapshot = await getDocs(resultsQuery);
        const attemptsCount = Math.min(3, resultsSnapshot.size);
        const remainingAttempts = Math.max(0, 3 - attemptsCount);
        setRemainingAttempts(remainingAttempts);
      } catch (error) {
        console.error('Erreur lors de la vérification du nombre de tentatives restantes :', error);
      }
    };

    checkRemainingAttempts();
  }, [authContext.currentUser.displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (remainingAttempts <= 0) {
      alert('Vous avez atteint le nombre maximal de tentatives pour ce quiz.');
      return;
    }

    let newScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        newScore += 1;
      }
    });
    setScore(newScore);

    const studentName = authContext.currentUser.displayName;

    try {
      await addDoc(collection(db, 'scorequizz'), {
        NomEtudiant: studentName,
        scoreMessage: `Vous avez obtenu ${newScore}/${questions.length} sur ce quiz.`,
        tentativesRestantes: remainingAttempts, 
      });

      // console.log('Score et nombre de tentatives ajoutés à Firestore avec succès!');
    } catch (error) {
      console.error('Erreur  :', error);
    }

    setQuizSubmitted(true);
    setShowSubmitButton(false);

    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement, index) => {
      if (userAnswers[index] === correctAnswers[index]) {
        questionElement.classList.add('correct');
      } else {
        questionElement.classList.add('wrong');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setRemainingAttempts((prevAttempts) => Math.max(0, prevAttempts - 1));
  };

  const handleOptionChange = (indexQuestion, value) => {
    if (!quizSubmitted) {
      const newAnswers = [...userAnswers];
      newAnswers[indexQuestion] = value;
      setUserAnswers(newAnswers);

      const isValid = newAnswers.every((answer) => answer !== '');
      setIsFormValid(isValid);
    }
  };

  const handleRetry = () => {
    setUserAnswers(Array(correctAnswers.length).fill(''));
    setScore(null);
    setIsFormValid(false);
    setQuizSubmitted(false);
    setShowSubmitButton(true);

    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement) => {
      questionElement.classList.remove('correct', 'wrong');
    });

    if (remainingAttempts <= 0) {
      toast.warning('Vous avez atteint le nombre maximal de tentatives pour ce quiz.');
    }
  };

  return (
    <main>
      <ToastContainer />
      <section className="quiz custom-quiz">
        <div className="heading">
          <p className="title">Quiz</p>
        </div>

        {score !== null && (
          <div className="result">
            <p className='fs-5'>{`Vous avez obtenu ${score}/${questions.length}!`}</p>
            <p className="reload">
              <button onClick={handleRetry}>Réessayer ?</button>
            </p>
          </div>
        )}

        {remainingAttempts > 0 && (
          <form className="quiz-form" onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <div key={index} className="question">
                <p className="fw-bolder fs-5">{`${index + 1}. ${q.question}`}</p>
                {q.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`option ${score !== null ? (userAnswers[index] === option
                      ? userAnswers[index] === correctAnswers[index]
                        ? 'correct'
                        : 'wrong'
                      : '') : ''}`}
                  >
                    <input
                      type="radio"
                      id={`q${index + 1}${optionIndex}`}
                      name={`q${index + 1}`}
                      value={option}
                      checked={userAnswers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      className="module"
                    />{' '}
                    &nbsp;
                    <label htmlFor={`q${index + 1}${optionIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            ))}
            <div className="submit">
              {showSubmitButton && !quizSubmitted && (
                <button className="btn btn-success" type="submit" disabled={!isFormValid}>
                  Soumettre
                </button>
              )}
            </div>
          </form>
        )}

        {remainingAttempts <= 0 && (
          <div>
            <p>Vous avez atteint le nombre maximal de tentatives.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Quiz;
