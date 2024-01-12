import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizGstInt = () => {
    const gestionIntQuizData = {
        questions: [
            {
              question: "Qu'est-ce que la gestion internationale?",
              options: ["La gestion des ressources humaines dans une entreprise",
               "La gestion des affaires à l'échelle mondiale",
                "La gestion des conflits internes", 
                "La gestion des relations publiques à l'international"],
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
              question: "Quels sont les avantages de la mondialisation?",
              options: [
                "Réduction de la concurrence sur le marché mondial",
                "Augmentation des barrières commerciales entre les pays",
                "Accès à de nouveaux marchés et sources de revenus",
                "Isolation économique des pays",
              ],
            },
            {
              question: "Qu'est-ce que l'investissement direct étranger (IDE)?",
              options: [
                "Un investissement dans des entreprises locales",
                "Un investissement dans des projets artistiques internationaux",
                "Un investissement dans des biens immobiliers à l'étranger",
                "Un investissement dans des entreprises situées à l'étranger",
              ],
            },
            {
              question: "Pourquoi les entreprises optent-elles pour la délocalisation?",
              options: [
                "Pour favoriser l'emploi local",
                "Pour réduire les coûts de production",
                "Pour renforcer les liens avec le gouvernement local",
                "Pour limiter leur présence sur les marchés internationaux",
              ],
            },
          ],
          correctAnswers: ["La gestion des affaires à l'échelle mondiale",
           "Étendre la présence de l'entreprise sur les marchés internationaux",
            "Une stratégie visant à élargir la gamme de produits à l'échelle mondiale",
             "Minimiser les risques potentiels liés aux opérations internationales"],
        };
  
  return (
    <>
    <h1 className="text-center">Gestion Internationale</h1>
    <Quiz quizData={gestionIntQuizData} />
    </>
  )
}

export default QuizGstInt;
