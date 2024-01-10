import React from 'react';
import Quiz from '../quizzs/Quiz';

const QuizGstEnt = () => {

    const gestionQuizData = {
        questions: [
          {
            question: "Qu'est-ce que le modèle SWOT en gestion d'entreprise?",
            options: ["Un modèle pour mesurer la force de gravité", "Une méthode d'analyse des forces, faiblesses, opportunités et menaces", "Un modèle de calcul des coûts de production", "Un modèle de gestion du temps"],
          },
          {
            question: "Qu'est-ce qu'un plan d'affaires?",
            options: ["Un plan pour la retraite des employés", "Un plan pour les vacances annuelles", "Un plan détaillé pour la création et la gestion d'une entreprise", "Un plan pour les réunions d'entreprise"],
          },
          {
            question: "Quel est le rôle d'un directeur financier?",
            options: ["Gérer les ressources humaines", "Superviser la production", "Gérer les finances et la comptabilité", "Concevoir des produits"],
          },
          {
            question: "Qu'est-ce que le leadership transformationnel?",
            options: ["Un style de leadership qui se concentre sur la discipline stricte", "Un style de leadership qui vise à inspirer et motiver les membres de l'équipe", "Un modèle de leadership basé sur la méritocratie", "Un modèle de leadership axé sur la délégation des tâches"],
          },
        ],
        correctAnswers: ["Une méthode d'analyse des forces, faiblesses, opportunités et menaces", "Un plan détaillé pour la création et la gestion d'une entreprise", "Gérer les finances et la comptabilité", "Un style de leadership qui vise à inspirer et motiver les membres de l'équipe"],
      };

  return (
    <>
    <h1>Gestion des Entreprises</h1>
    <Quiz quizData={gestionQuizData} />

    </>
  )
}

export default QuizGstEnt