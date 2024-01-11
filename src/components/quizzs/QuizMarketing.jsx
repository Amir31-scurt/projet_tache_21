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
        question: "Quel est l'objectif principal d'une campagne publicitaire?",
        options: ["Augmenter la notoriété de la marque", "Baisser les prix des produits", "Recruter de nouveaux employés", "Vendre des actions de l'entreprise"],
      },
      {
        question: "Qu'est-ce que la segmentation du marché?",
        options: [
          "La division d'un marché en groupes homogènes de consommateurs",
          "Le processus d'organisation des produits sur les étagères des magasins",
          "La détermination du prix de vente optimal",
          "La création d'une nouvelle marque sur le marché",
        ],
      },
      {
        question: "Quelle est la différence entre la publicité et la promotion?",
        options: [
          "Il n'y a aucune différence, ce sont des termes interchangeables",
          "La publicité vise à informer, tandis que la promotion vise à inciter à l'achat",
          "La publicité concerne les produits, la promotion concerne les services",
          "La publicité est gratuite, la promotion est payante",
        ],
      },
      {
        question: "Qu'est-ce qu'une étude de marché?",
        options: [
          "Une analyse des tendances de marché passées",
          "Une enquête auprès des concurrents",
          "Une évaluation de la demande pour un produit ou service sur le marché",
          "Un rapport financier annuel d'une entreprise",
        ],
      },
      {
        question: "Quel est le rôle d'un directeur marketing?",
        options: [
          "Gérer les ressources humaines",
          "Superviser la production",
          "Concevoir des produits",
          "Développer et mettre en œuvre des stratégies marketing",
        ],
      },
    ],
    correctAnswers: [
      "Comment une marque est perçue dans l'esprit des consommateurs",
      "Augmenter la notoriété de la marque",
      "La division d'un marché en groupes homogènes de consommateurs",
      "La publicité vise à informer, tandis que la promotion vise à inciter à l'achat",
      "Une évaluation de la demande pour un produit ou service sur le marché",
      "Développer et mettre en œuvre des stratégies marketing",
    ],
  };

  return (
    <>
      <h1>Marketing</h1>
      <Quiz quizData={marketingQuizData} />
    </>
  );
};

export default QuizMarketing;
