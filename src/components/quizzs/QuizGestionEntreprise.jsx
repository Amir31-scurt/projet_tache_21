import React from "react";
import Quiz from "./Quiz";

const QuizGestionEntreprise = () => {
  const gestionQuizData = {
    questions: [
      {
        question: "Qu'est-ce que le modèle SWOT en gestion d'entreprise?",
        options: [
          "Un modèle pour mesurer la force de gravité",
          "Une méthode d'analyse des forces, faiblesses, opportunités et menaces",
          "Un modèle de calcul des coûts de production",
          "Un modèle de gestion du temps",
        ],
      },
      {
        question: "Qu'est-ce que le marché cible?",
        options: [
          "Un lieu où les marchandises sont vendues",
          "Le groupe démographique spécifique auquel un produit est destiné",
          "Un lieu où se déroulent des transactions financières",
          "Le prix d'un produit sur le marché",
        ],
      },
      {
        question: "Qu'est-ce que le marketing mix?",
        options: [
          "Un ensemble d'outils de bricolage",
          "Une stratégie de promotion des produits",
          "Une combinaison de facteurs contrôlables influençant la décision d'achat d'un client",
          "Un groupe de personnes travaillant dans le domaine du marketing",
        ],
      },
      {
        question: "Quelle est l'importance de la gestion des stocks?",
        options: [
          "Réduire les coûts de gestion",
          "Assurer la disponibilité constante des produits",
          "Augmenter les coûts opérationnels",
          "Minimiser la rentabilité de l'entreprise",
        ],
      },
      {
        question:
          "Qu'est-ce que la responsabilité sociale des entreprises (RSE)?",
        options: [
          "Un rapport financier annuel",
          "L'obligation des entreprises de contribuer au bien-être de la société",
          "Une méthode de gestion des risques",
          "Un plan de marketing",
        ],
      },
      {
        question: "Qu'est-ce qu'un plan d'affaires?",
        options: [
          "Un plan détaillé pour la création et la gestion d'une entreprise",
          "Gérer les finances et la comptabilité",
          "Un style de leadership qui vise à inspirer et motiver les membres de l'équipe",
          "Une stratégie de développement durable",
        ],
      },
    ],
    correctAnswers: [
      "Une méthode d'analyse des forces, faiblesses, opportunités et menaces",
      "Le groupe démographique spécifique auquel un produit est destiné",
      "Une combinaison de facteurs contrôlables influençant la décision d'achat d'un client",
      "Assurer la disponibilité constante des produits",
      "L'obligation des entreprises de contribuer au bien-être de la société",
      "Un plan détaillé pour la création et la gestion d'une entreprise",
    ],
  };

  return (
    <>
      <h1 className="text-center">Gestion des Entreprises</h1>
      <Quiz quizData={gestionQuizData} />
    </>
  );
};

export default QuizGestionEntreprise;
