import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizGstInt = () => {
    const gestionIntQuizData = {
        questions: [
            {
              question: "Qu'est-ce que la gestion internationale?",
              options: ["La gestion des ressources humaines dans une entreprise", "La gestion des affaires à l'échelle mondiale", "La gestion des conflits internes", "La gestion des relations publiques à l'international"],
            },
            {
              question: "Quel est l'objectif principal de la gestion internationale?",
              options: ["Maximiser les profits à court terme", "Étendre la présence de l'entreprise sur les marchés internationaux", "Réduire les coûts de production nationaux", "Promouvoir les politiques gouvernementales"],
            },
            {
              question: "Qu'est-ce que la diversification internationale?",
              options: ["Une stratégie visant à élargir la gamme de produits à l'échelle mondiale", "Une méthode pour recruter des employés de différentes nationalités", "La promotion de la diversité culturelle au sein de l'entreprise", "La gestion des problèmes de diversité"],
            },
            {
              question: "Quel est le rôle de la gestion des risques dans le contexte international?",
              options: ["Éviter complètement les risques", "Minimiser les risques potentiels liés aux opérations internationales", "Ignorer les risques car ils sont inévitables", "Transférer tous les risques aux partenaires internationaux"],
            },
          ],
          correctAnswers: ["La gestion des affaires à l'échelle mondiale", "Étendre la présence de l'entreprise sur les marchés internationaux", "Une stratégie visant à élargir la gamme de produits à l'échelle mondiale", "Minimiser les risques potentiels liés aux opérations internationales"],
        };
  return (
    <>
    <h1>Gestion Internationale</h1>
    <Quiz quizData={gestionIntQuizData} />

    </>
  )
}

export default QuizGstInt