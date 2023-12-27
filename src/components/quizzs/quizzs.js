
import React from "react";
import Score from "./score";


function Quizzs() {
  const lessons = ["Programme 01: HTML/CSS",
   "Programme 02: JavaScript",
    "Programme 03: PHP", 
    "Programme 04: PYTHON"];
  const quizzes = [
  "Quizs Final HTML/CSS", 
  "Quizs Final JavaScript",
  "Quizs Final REACT JS",
   "Quizs Final LARAVEL"];

  return(
    <Score  lessons={lessons} quizzes={quizzes}/>
  )
}

export default  Quizzs;

