import React from "react";
import Quiz from "../quizzs/Quiz";

const QuizGstEnt = () => {
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
        question: "Qu'est-ce qu'un plan d'affaires?",
        options: [
          "Un plan pour la retraite des employés",
          "Un plan pour les vacances annuelles",
          "Un plan détaillé pour la création et la gestion d'une entreprise",
          "Un plan pour les réunions d'entreprise",
        ],
      },
      {
        question: "Quel est le rôle d'un directeur financier?",
        options: [
          "Gérer les ressources humaines",
          "Superviser la production",
          "Gérer les finances et la comptabilité",
          "Concevoir des produits",
        ],
      },
      {
        question: "Qu'est-ce que le leadership transformationnel?",
        options: [
          "Un style de leadership qui se concentre sur la discipline stricte",
          "Un style de leadership qui vise à inspirer et motiver les membres de l'équipe",
          "Un modèle de leadership basé sur la méritocratie",
          "Un modèle de leadership axé sur la délégation des tâches",
        ],
      },
      // Ajout de quatre nouvelles questions
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
    ],
    correctAnswers: [
      "Une méthode d'analyse des forces, faiblesses, opportunités et menaces",
      "Un plan détaillé pour la création et la gestion d'une entreprise",
      "Gérer les finances et la comptabilité",
      "Un style de leadership qui vise à inspirer et motiver les membres de l'équipe",
      "Le groupe démographique spécifique auquel un produit est destiné",
      "Une combinaison de facteurs contrôlables influençant la décision d'achat d'un client",
      "Assurer la disponibilité constante des produits",
      "L'obligation des entreprises de contribuer au bien-être de la société",
    ],
  };

  return (
    <>
      <h1>Gestion des Entreprises</h1>
      <Quiz quizData={gestionQuizData} />
    </>
  );
};

export default QuizGstEnt;
