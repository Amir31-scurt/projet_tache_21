import React from "react";
import Score from "./score";


function Quizzs() {
  const lessons = ["Programme 01: Management International",
   "Programme 02: Gestion Interculturelle",
    "Programme 03: Commerce Internationnal ", 
    "Programme 04: Gestion des Affaires Internationales"];
  const quizzes = [
  "Quizs Final Management International", 
  "Quizs Final Gestion Interculturelle",
  "Quizs Final Commerce Internationnal",
   "Quizs Final Gestion des Affaires Internationnales"];

  return(
    <Score  lessons={lessons} quizzes={quizzes} />
  )
}

export default  Quizzs;