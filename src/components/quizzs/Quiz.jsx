import React, { useState, useContext, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../../contexte/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Quiz = ({ quizData }) => {
  // Récupérer les données du quiz
  const { questions, correctAnswers } = quizData;
  
  // Récupérer le contexte d'authentification
  const authContext = useContext(AuthContext);

  // États du composant
  const [userAnswers, setUserAnswers] = useState(Array(correctAnswers.length).fill(''));
  const [score, setScore] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  // Effet de mise à jour pour vérifier les tentatives restantes
  useEffect(() => {
    // Nom de l'étudiant
    const studentName = authContext.currentUser.displayName;

    // Fonction asynchrone pour vérifier les tentatives restantes
    const checkRemainingAttempts = async () => {
      try {
        // Requête pour obtenir les résultats du quiz de l'étudiant
        const resultsQuery = query(collection(db, 'scorequizz'), where('NomEtudiant', '==', studentName));
        const resultsSnapshot = await getDocs(resultsQuery);
        // Calcul du nombre de tentatives restantes
        const attemptsCount = Math.min(3, resultsSnapshot.size); 
        const remainingAttempts = Math.max(0, 3 - attemptsCount);
        setRemainingAttempts(remainingAttempts);
      } catch (error) {
        console.error('Erreur lors de la vérification du nombre de tentatives restantes :', error);
      }
    };

    // Appeler la fonction pour vérifier les tentatives restantes
    checkRemainingAttempts();
  }, [authContext.currentUser.displayName]);

  // Fonction de soumission du quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si le nombre maximal de tentatives a été atteint
    if (remainingAttempts <= 0) {
      alert('Vous avez atteint le nombre maximal de tentatives pour ce quiz.');
      return;
    }

    // Calculer le nouveau score
    let newScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        newScore += 1;
      }
    });
    setScore(newScore);

    // Nom de l'étudiant
    const studentName = authContext.currentUser.displayName;

    try {
      // Ajouter le score et le nombre de tentatives à Firestore
      await addDoc(collection(db, 'scorequizz'), {
        NomEtudiant: studentName,
        scoreMessage: `Vous avez obtenu ${newScore}/${questions.length} sur ce quiz.`,
        tentativesRestantes: remainingAttempts, 
      });

      console.log('Score et nombre de tentatives ajoutés à Firestore avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du score et du nombre de tentatives à Firestore :', error);
    }

    // Mettre à jour les états pour indiquer que le quiz a été soumis
    setQuizSubmitted(true);
    setShowSubmitButton(false);

    // Mettre en surbrillance les questions correctes et incorrectes
    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement, index) => {
      if (userAnswers[index] === correctAnswers[index]) {
        questionElement.classList.add('correct');
      } else {
        questionElement.classList.add('wrong');
      }
    });

    // Faire défiler vers le haut de la page 
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mettre à jour le nombre de tentatives restantes dans l'état
    setRemainingAttempts((prevAttempts) => Math.max(0, prevAttempts - 1));
  };

  // Fonction de gestion du changement d'option
  const handleOptionChange = (indexQuestion, value) => {
    // Vérifier si le quiz n'a pas été soumis
    if (!quizSubmitted) {
      // Mettre à jour les réponses de l'utilisateur
      const newAnswers = [...userAnswers];
      newAnswers[indexQuestion] = value;
      setUserAnswers(newAnswers);

      // Vérifier la validité du formulaire
      const isValid = newAnswers.every((answer) => answer !== '');
      setIsFormValid(isValid);
    }
  };

  // Fonction de réessai du quiz
  const handleRetry = () => {
    // Réinitialiser les états pour réessayer le quiz
    setUserAnswers(Array(correctAnswers.length).fill(''));
    setScore(null);
    setIsFormValid(false);
    setQuizSubmitted(false);
    setShowSubmitButton(true);

    // Réinitialiser les styles des questions
    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach((questionElement) => {
      questionElement.classList.remove('correct', 'wrong');
    });

    // Afficher un message si le nombre maximal de tentatives a été atteint
    if (remainingAttempts <= 0) {
      toast.warning('Vous avez atteint le nombre maximal de tentatives pour ce quiz.');
    }
  };

  return (
    <main>
      <ToastContainer />
      <section className="quiz">
        <div className="heading">
          <p className="title">Quiz</p>
        </div>

        {score !== null && (
          // Afficher le résultat du quiz
          <div className="result">
            <p>{`Vous avez obtenu ${score}/${questions.length}!`}</p>
            <p className="reload">
              <button onClick={handleRetry}>Réessayer ?</button>
            </p>
          </div>
        )}

        {remainingAttempts > 0 && (
          // Afficher le formulaire du quiz
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
          // Afficher un message si le nombre maximal de tentatives a été atteint
          <div>
            <p>Vous avez atteint le nombre maximal de tentatives.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Quiz;
