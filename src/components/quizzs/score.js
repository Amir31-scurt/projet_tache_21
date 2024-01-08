import React, { useContext, useState } from 'react';
import { quizzes } from './question';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { AuthContext } from '../../contexte/AuthContext';
import { ToastContainer, toast } from 'react-toastify';

const ContentBlock = ({ title, content, onClick, icons }) => (
  <div className="content-block" onClick={onClick}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

function shuffleArray(array) {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const Quiz = ({
  questions,
  onFinish,
  selectedAnswers,
  setSelectedAnswers,
  setUserScore,
  isQuizFinished,
}) => {
  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (questions[questionIndex].correctAnswerIndex === answerIndex) {
      setUserScore((prevScore) => prevScore + 2);
    }
  };

  return (
    <div className="quiz-container">
      {questions.map((questionObj, questionIndex) => (
        <div key={`question-${questionIndex}`}>
          <h6 className="question">{questionObj.question}</h6>
          {questionObj.shuffledAnswers.map((answer, answerIndex) => (
            <div key={`answer-${answerIndex}`} className="answer">
              <input
                type="radio"
                name={`question-${questionIndex}`}
                checked={selectedAnswers[questionIndex] === answerIndex}
                onChange={() => handleAnswerChange(questionIndex, answerIndex)}
                id={`answer-${questionIndex}-${answerIndex}`}
                disabled={isQuizFinished}
              />
              <label
                htmlFor={`answer-${questionIndex}-${answerIndex}`}
                className="label"
              >
                {answer}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        className="finish-quiz btn btn-primary"
        onClick={onFinish}
      >
        TERMINER
      </button>
    </div>
  );
};

export default function Score() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const { uid } = useContext(AuthContext);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const prepareQuestions = (quizIndex) => {
    const questionsWithShuffledAnswers = quizzes[quizIndex].questions.map(
      (question) => {
        const correctAnswer = question.answers[1]; // Assuming correct answer is at index 1
        const shuffledAnswers = shuffleArray(question.answers);
        const correctAnswerIndex = shuffledAnswers.findIndex(
          (answer) => answer === correctAnswer
        );

        return { ...question, shuffledAnswers, correctAnswerIndex };
      }
    );

    setShuffledQuestions(questionsWithShuffledAnswers);
  };

  const handleContentBlockClick = (index) => {
    setSelectedQuiz(index);
    setSelectedAnswers(Array(quizzes[index].questions.length).fill(null));
    setUserScore(0);
    setIsQuizFinished(false);
    prepareQuestions(index);
  };

  const handleQuizFinish = async () => {
    setIsQuizFinished(true);
    setFinalScore(userScore);

    if (selectedQuiz !== null) {
      const userResponsesRef = collection(db, 'userResponses');
      const userResponsesData = {
        userId: uid,
        quizTitle: quizzes[selectedQuiz].title,
        userScore: userScore,
        userAnswers: selectedAnswers,
        correctAnswers: selectedAnswers.map(
          (answerIndex, i) =>
            answerIndex === shuffledQuestions[i].correctAnswerIndex
        ),
        timestamp: new Date(),
      };

      try {
        const docRef = await addDoc(userResponsesRef, userResponsesData);
        console.log('User responses added with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding user responses: ', error);
        toast.error(`Error adding user responses: ${error}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
  };

  const lessons = [
    'Programmation 01: Management International',
    'Programmation 02: Gestion interculturelle',
    'Programmation 03: Commerce International',
    'Programmation 04: Gestions des Affaires Internationales',
  ];

  return (
    <div className="module-container">
      <div className="col-md-3 sidebar">
        <div className="file">
          <h2 className="text-center">Programme</h2>
          {lessons.map((lesson, index) => (
            <div key={`lesson-${index}`} className="lesson-item">
              {lesson}
            </div>
          ))}

          <h2 className="text-center">PRACTICE QUIZ</h2>
          {quizzes.map((quiz, index) => (
            <ContentBlock
              key={`quiz-${index}`}
              title={quiz.title}
              content={quiz.description}
              onClick={() => handleContentBlockClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="col-md-9 main-content">
        {selectedQuiz !== null && (
          <Quiz
            questions={shuffledQuestions}
            onFinish={handleQuizFinish}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            setUserScore={setUserScore}
            isQuizFinished={isQuizFinished}
          />
        )}
        {finalScore !== null && (
          <h3 className="final-score">Note finale : {finalScore} / 20</h3>
        )}
      </div>
    </div>
  );
}
