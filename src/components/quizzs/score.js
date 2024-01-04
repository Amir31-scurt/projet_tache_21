import React, { useContext, useState , useEffect} from "react";
import { quizzes } from "./question";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from "../../config/firebase-config";
import  { AuthContext } from "../../contexte/AuthContext";

const ContentBlock = ({ title, content, onClick, icons }) => (
  <div className="content-block" onClick={onClick}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

const Quiz = ({ questions, onFinish }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill([]));
  const [userScore, setUserScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Effacer les réponses et marquer le quiz comme non terminé lorsque les questions changent
  useEffect(() => {
    setSelectedAnswers(Array(questions.length).fill([]));
    setUserScore(0);
    setQuizFinished(false);
  }, [questions]);

  const handleAnswerChange = (questionIndex, answerIndex, correct) => {
    // Vérifier si le quiz est terminé
    if (quizFinished) {
      return;
    }

    const newAnswers = [...selectedAnswers];

    // Basculer la sélection de la réponse
    newAnswers[questionIndex] = { answerIndex, correct };

    setSelectedAnswers(newAnswers);

    if (correct) {
      setUserScore((prevScore) => prevScore + 2);
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
        <div key={`question-${questionIndex}`}>
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
              <label className="label">{answer}</label>
            </div>
          ))}
        </div>
      ))}
      <div className="">
        <button type="button" className="sous" onClick={handleFinishClick}>
          TERMINER
        </button>
      </div>
    </div>
  );
};
export default function Score() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(10).fill(null));
  const {uid} = useContext(AuthContext);
  console.log("Le userUid =", uid);

  const handleContentBlockClick = (index) => {
    setSelectedQuiz(index);
  };

  const handleQuizFinish = async (score, utilisateurs,) => {
    setFinalScore(score);

    if (selectedQuiz !== null) {
      // stocker les réponses des utilisateurs 
      const userResponsesRef = collection(db, 'utilisateurs');

      // Stocker les données dans Firestore
      const userResponsesData = {
        userId: uid,
        quizTitle: quizzes[selectedQuiz].title,
        userScore: score,
        userAnswers: quizzes[selectedAnswers, 0],
        correctAnswers: quizzes[selectedQuiz].questions.map((question) => question.correctAnswer),
        timestamp: new Date(),
      };
      console.log(userResponsesData)

      // Ajouter les réponses des utilisateurs à Firestore
      try {
        const docRef = await addDoc(userResponsesRef, userResponsesData , );
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
         {/* {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} />}  */}
        {selectedQuiz !== null && <Quiz questions={quizzes[selectedQuiz].questions} onFinish={handleQuizFinish} />}
        {finalScore !== null && <h3 className="final-score">Note finale : {finalScore} / 20</h3>}
        
        
      </div>
    </div>
  );
}