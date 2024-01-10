import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizMarketing = () => {
    const marketingQuizData = {
      questions: [
        {
          question: "Qu'est-ce que le positionnement marketing?",
          options: ["Le lieu où se trouve le bureau marketing", "Comment une marque est perçue dans l'esprit des consommateurs", "La manière dont les produits sont disposés sur une étagère", "La géolocalisation des publicités"],
        },
        {
          question: "Qu'est-ce que le mix marketing?",
          options: ["Un ensemble de quatre P: produit, prix, place, promotion", "La musique jouée dans les publicités", "Une stratégie pour mélanger différents types de marketing", "Les partenariats entre différentes marques"],
        },
        {
          question: "Qu'est-ce que le marché cible?",
          options: ["Un endroit où se réunissent les concurrents", "Le groupe démographique spécifique auquel une entreprise s'adresse", "Le marché des produits électroniques", "Une méthode de tarification des produits"],
        },
        {
          question: "Quel est l'objectif principal d'une campagne publicitaire?",
          options: ["Augmenter la notoriété de la marque", "Baisser les prix des produits", "Recruter de nouveaux employés", "Vendre des actions de l'entreprise"],
        },
      ],
      correctAnswers: ["Comment une marque est perçue dans l'esprit des consommateurs", "Un ensemble de quatre P: produit, prix, place, promotion", "Le groupe démographique spécifique auquel une entreprise s'adresse", "Augmenter la notoriété de la marque"],
    };
  return (
    <>
    <h1>Marketing</h1>
    <Quiz quizData={marketingQuizData} />
    </>
  )
}

export default QuizMarketing