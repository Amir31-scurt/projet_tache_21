import React, { useContext, useState , useEffect} from "react";
import { quizzes } from "./question";
import 'bootstrap/dist/css/bootstrap.min.css';
import {collection, addDoc, getDoc, } from 'firebase/firestore';
import { db } from "../../config/firebase-config";
import  { AuthContext } from "../../contexte/AuthContext";

const ContentBlock = ({ title, content, onClick, icons }) => (
  <div className="content-block" onClick={onClick}>
    <h2 className="fs-3">{title}</h2>
    <p>{content}</p>
  </div>
);

const Quiz = ({ questions, onFinish, quiz }) => {
  const [points, setPoints] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill([]));
  const [userScore, setUserScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  

  // Effacer les réponses et marquer le quiz comme non terminé lorsque les questions changent
  useEffect(() => {
    setSelectedAnswers(Array(questions.length).fill([]));
    setUserScore(0);
    setQuizFinished(false);
  }, [questions]);

  const handleAnswerChange = (questionIndex, answerIndex, correct,selectedAnswers) => {
    const correctAnswer = quiz.questions[questionIndex].correctAnswer;

    // Vérifier si le quiz est terminé
    if (quizFinished) {
      return;
    }

    const newAnswers = [...selectedAnswers];

    // Basculer la sélection de la réponse
    newAnswers[questionIndex] = { answerIndex, correct };

    setSelectedAnswers(newAnswers);
    if (selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswer) {
     
      setPoints(points + 2);
      alert("Gagnez 2 points !");
    } else if (selectedAnswers.length === 2 && selectedAnswers.includes(0) && selectedAnswers.includes(2)) {
      alert("Aucun point gagné.");
    } else {
     
      alert("Aucun point gagné.");
    }
      }

      const handleNextClick = () => {
        
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    
  
        if (currentQuestionIndex === questions.length - 1) {
          setQuizFinished(true);
        }
      };

      

      

  const handleFinishClick = () => {
    // Marquer le quiz comme terminé
    setQuizFinished(true);
    // Appeler la fonction onFinish avec le score
    onFinish(userScore);
  };

  return (
    <div className="espace-tru">
    {questions.map((questionObj, questionIndex) => (
      <div key={`question-${questionIndex}`} style={{ display: currentQuestionIndex === questionIndex ? 'block' : 'none' }}>
        <h6 className="paragraph">{questionObj.question}</h6>
        {questionObj.answers.map((answer, answerIndex) => (
          <div key={`answer-${answerIndex}`} className="dig">
            <input
              type="radio"
              checked={selectedAnswers[questionIndex]?.answerIndex === answerIndex}
              onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.checked)}
              id={`answer-${questionIndex}-${answerIndex}`}
              disabled={quizFinished} // Désactiver les inputs si le quiz est terminé
            />
            <button htmlFor={`answer-${questionIndex}-${answerIndex}`} className="label ms-2 p-2 g-col-6">
              {answer}
            </button>
          </div>
          
        ))}
        {currentQuestionIndex < questions.length - 1 && (
          <button type="button" className="sous" onClick={handleNextClick}>
            Suivant
          </button>
        )}
      </div>
    ))}
    {quizFinished ? (
      <div className="score-container">
        
      </div>
    ) : (
      <div className="">
      {currentQuestionIndex === questions.length - 1 && (
        <button type="submit" className="sous" onClick={handleFinishClick}>
          TERMINER
        </button>
      )}
      </div>
    )}
  </div>
  );
};
export default function Score() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const {uid, currentUser} = useContext(AuthContext);
  // console.log("Le userUid =", uid);

  const handleContentBlockClick = (index,) => {
    setSelectedQuiz(index);
  };

const handleQuizFinish = async (score) => {
    setFinalScore(score);
  
    if (selectedQuiz !== null) {
      // stocker les réponses des utilisateurs 

      // Stocker les données dans Firestore
      const userResponsesData = {
        userId: currentUser,
        quizTitle: quizzes[selectedQuiz].title,
        userScore: score,
        userAnswers: quizzes[selectedAnswers, 0],
        correctAnswers: quizzes[selectedQuiz].questions.map((question) => question.correctAnswer),
        timestamp: new Date(),
      };
      console.log(userResponsesData);

      const userResponsesRef = collection(db, 'utilisateurs');

      // Ajouter les réponses des utilisateurs à Firestore
      try {
        const docRef = await getDoc(userResponsesRef, userResponsesData);
        if (docRef.exists()) {
          await addDoc(userResponsesRef, userResponsesData, { merge: true });
        } else {
          await addDoc(userResponsesRef, userResponsesData);
        }
        console.log('User responses added with ID: ', docRef.uid);
      } catch (error) {
        console.error('Error adding user responses: ', error);
      }
     
    }
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

          <h2 className="text-center fs-4">PRACTICE QUIZ</h2>
          {quizzes && (
            <>

              {quizzes.map((quiz, id) => (
                <ContentBlock
                  key={`quiz-${id}`}
                  title={quiz.title}
                  icons={quiz.icons}
                  content={quiz.description}
                  onClick={() => handleContentBlockClick(id)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className=" col-md-9 main-content">
         {/* {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} />}  */}
        {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} onFinish={handleQuizFinish} />}
        {finalScore !== null && <h3 className="final-score">Note finale : {finalScore} / 100</h3>}
        
        
      </div>
    </div>
  );
}