import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizFinance = () => {
    const financeQuizData = {
        questions: [
            {
              question: "Qu'est-ce que le marché boursier?",
              options: ["Un marché où l'on échange des biens de consommation", "Un marché où l'on échange des devises étrangères", "Un marché où l'on échange des actions et des titres financiers", "Un marché où l'on échange des biens immobiliers"],
            },
            {
              question: "Qu'est-ce qu'une devise?",
              options: ["Une unité monétaire émise par une banque centrale", "Un produit échangé sur le marché boursier", "Un impôt sur le revenu", "Un bien immobilier à l'étranger"],
            },
            // Ajout de nouvelles questions
            {
              question: "Qu'est-ce que l'analyse financière?",
              options: [
                "Un examen des tendances climatiques affectant les entreprises",
                "Une évaluation des performances financières d'une entreprise",
                "Une étude sur les mouvements artistiques et culturels",
                "Un rapport sur les progrès technologiques dans le domaine financier",
              ],
            },
            {
              question: "Qu'est-ce qu'un fonds commun de placement (FCP)?",
              options: [
                "Un compte bancaire destiné à des projets spécifiques",
                "Un organisme sans but lucratif",
                "Un fonds d'investissement géré collectivement",
                "Un document officiel émis par le gouvernement",
              ],
            },
            {
              question: "Quelle est la fonction principale d'un comptable?",
              options: [
                "La gestion des ressources humaines",
                "La conception de produits innovants",
                "L'analyse des données financières et la tenue des comptes",
                "La supervision de la production",
              ],
            },
            {
              question: "Qu'est-ce que l'amortissement en comptabilité?",
              options: [
                "Une méthode pour augmenter la valeur des actifs",
                "Une réduction progressive de la valeur d'un actif",
                "Un calcul des recettes et des dépenses",
                "Une stratégie pour maximiser les profits",
              ],
            },
          ],
          correctAnswers: ["Un marché où l'on échange des actions et des titres financiers", "Le total des biens et services produits dans un pays sur une période donnée", "Une action ou un titre négociable", "Une unité monétaire émise par une banque centrale"],
        };
    
  return (
    <>
      <h1>Finance</h1>
    <Quiz quizData={financeQuizData} />
    </>
  );
};

export default QuizFinance;
