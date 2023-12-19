
import React from "react";
import Score from "./score";


function Quizzs() {
  const lessons = ["Programme 01: HTML/CSS", "Programme 02: JavaScript", "Programme 03: REACT JS", "Programme 04:"];
  const quizzes = ["Quizs Final HTML/CSS", "Quizs Final JavaScript", "Quizs Final REACT JS", "Quizs Final LARAVEL"];

  return(
    <Score  lessons={lessons} quizzes={quizzes}/>
  )
}

export default  Quizzs;

