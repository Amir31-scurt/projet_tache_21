import React from 'react';
import { MultiCascader } from 'rsuite';
import AssignationCoach from './AssignationCoach';

const AdminAssignation = () => {
  // Récupèration des options à partir du composant AssignationCoach
  const options = AssignationCoach();

  return (
    <div
      className="container text-center mt-5 w-100"
      style={{ width: '100%', paddingLeft: 30 }}
    >
      <div className="text-center text">
        <h2 className="text-bolder">Tableau de bord de l' Admin</h2>
        <p>Sélectionnez un programme pour assigner des tâches aux coach.</p>
      </div>
      {/* Utilise le composant MultiCascader de rsuite avec les options récupérées */}
      <MultiCascader
        style={{
          width: '100%',
          maxWidth: 600,
          margin: '20px auto', // Centre le composant
          border: '1px solid #ccc', // Ajoute une bordure
          borderRadius: 5, // Ajoute des coins arrondis
        }}
        placeholder="Sélectionnez"
        data={options}
        // Ajoutez des styles spécifiques à la liste déroulante si nécessaire
        menuStyle={{
          height: '50vh',
          maxHeight: 200, // Limite la hauteur de la liste déroulante
          overflowY: 'auto', // Ajoute une barre de défilement en cas de dépassement de la hauteur
        }}
        // Permet la sélection d'un seul élément à la fois
        checkStrictly
        // Active la recherche pour faciliter la sélection
        searchable
      />
    </div>
  );
};

export default AdminAssignation;
