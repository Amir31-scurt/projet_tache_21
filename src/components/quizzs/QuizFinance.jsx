import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizFinance = () => {
    const gestionIntQuizData = {
        questions: [
            {
              question: "Qu'est-ce que le marché boursier?",
              options: ["Un marché où l'on échange des biens de consommation", "Un marché où l'on échange des devises étrangères", "Un marché où l'on échange des actions et des titres financiers", "Un marché où l'on échange des biens immobiliers"],
            },
            {
              question: "Qu'est-ce que le PIB (Produit Intérieur Brut)?",
              options: ["Le total des biens et services produits dans un pays sur une période donnée", "Le total des bénéfices des entreprises nationales", "Le total des recettes fiscales du gouvernement", "Le total des dépenses du gouvernement"],
            },
            {
              question: "Qu'est-ce qu'un actif financier?",
              options: ["Un bien physique, comme une maison ou une voiture", "Une obligation de paiement d'un emprunt", "Une action ou un titre négociable", "Une taxe sur les biens immobiliers"],
            },
            {
              question: "Qu'est-ce qu'une devise?",
              options: ["Une unité monétaire émise par une banque centrale", "Un produit échangé sur le marché boursier", "Un impôt sur le revenu", "Un bien immobilier à l'étranger"],
            },
          ],
          correctAnswers: ["Un marché où l'on échange des actions et des titres financiers", "Le total des biens et services produits dans un pays sur une période donnée", "Une action ou un titre négociable", "Une unité monétaire émise par une banque centrale"],
        };
    
  return (
    <>
      <h1>Gestion Internationale</h1>
    <Quiz quizData={gestionIntQuizData} />
    </>
   

  );
};

export default QuizFinance