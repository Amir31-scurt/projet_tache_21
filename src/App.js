import React from 'react';
import './App.css';
import AssignationPage from './pages/pageAssignation/AssignationPage';

function App() {
  // const [selectedSubject, setSelectedSubject] = useState(null);

  // // Fonction pour gérer la sélection du programme choisit
  // const handleSubjectSelect = (subject) => {
  //   setSelectedSubject(subject);
  // };

  return (
    <div className="App">
      <AssignationPage />


      {/* Utilisation du composant PageAssignation avec la fonction onSelect */}
      {/* <PageAssignation onSelect={handleSubjectSelect} /> */}
    </div>
  );
}

export default App;
