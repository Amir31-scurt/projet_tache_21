// import react from 'react';
import { MultiCascader } from 'rsuite';
import Assignation from './Assignation';

const AssignationPage = () => {
  // Récupère les options à partir du composant Assignation
  const options = Assignation();

  return (
    <div className="container text-center mt-5 w-100" style={{ display: 'block', width: 500, paddingLeft: 30 }}>
      <div className="text-center text">
        <h2 className='text-bolder'>Tableau de bord du coach</h2>
        <p>Sélectionnez un programme pour assigner des tâches aux étudiants.</p>
      </div>
      {/* Utilise le composant MultiCascader de rsuite avec les options récupérées */}
      <MultiCascader
        style={{
          width: 600,
          marginTop: 20, // Ajoute un espace en haut du tableau
          border: '1px solid #ccc', // Ajoute une bordure
          borderRadius: 5, // Ajoute des coins arrondis
        }}
        placeholder="Sélectionnez"
        data={options}
        // Ajoutez des styles spécifiques à la liste déroulante si nécessaire
        menuStyle={{
          maxHeight: 200, // Limite la hauteur de la liste déroulante
          overflowY: 'auto', // Ajoute une barre de défilement en cas de dépassement de la hauteur
        }}
      />
    </div>
  );
};

export default AssignationPage;
