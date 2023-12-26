import React from 'react';

const BulletinEtudiant = () => {
  const InfoEtudiant = {
    nom: 'Bamidele',
    prenom: 'Alli',
    email: 'dele@gmail.com',
    numero: '770011',
    domaine: 'Programmation',
    professeur: 'Zack',
    trimestre: '2',
  };

  const bulletins = [
    {
      domaine: 'JavaScript',
      note: '14',
      ponctualite: 'Excellent',
      assiduite: '90%',
      notes: { examen: 18, projet: 16, devoirs: 20 },
    },
    {
      domaine: 'Laravel',
      note: '12',
      ponctualite: 'Bien',
      assiduite: '85%',
      notes: { examen: 14, projet: 18, devoirs: 16 },
    },
    {
      domaine: 'Flutter',
      note: '16',
      ponctualite: 'Très bien',
      assiduite: '95%',
      notes: { examen: 16, projet: 20, devoirs: 18 },
    },
  ];

  const calculerMoyenne = (notes) => {
    const total = notes.reduce((acc, note) => acc + note, 0);
    return total / notes.length;
  };

  const moyenneGenerale = calculerMoyenne(bulletins.map(bulletin => bulletin.notes.examen));

  const choisirAppreciation = (moyenne) => {
    if (moyenne >= 16) {
      return "Très bien, excellent travail !";
    } else if (moyenne >= 12) {
      return "Bien, continuez vos efforts.";
    } else {
      return "Peut faire mieux, travaillons ensemble pour améliorer.";
    }
  };

  const appreciation = choisirAppreciation(moyenneGenerale);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bulletin de l'étudiant</h2>
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Informations de l'étudiant</h3>
              <p className="card-text">Nom: {InfoEtudiant.nom}</p>
              <p className="card-text">Prénom: {InfoEtudiant.prenom}</p>
              <p className="card-text">Email: {InfoEtudiant.email}</p>
              <p className="card-text">Numéro: {InfoEtudiant.numero}</p>
              <p className="card-text">Domaine: {InfoEtudiant.domaine}</p>
              <p className="card-text">Professeur: {InfoEtudiant.professeur}</p>
              <p className="card-text">Trimestre: {InfoEtudiant.trimestre}</p>
            </div>
          </div>
        </div>
        {bulletins.map((bulletin, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">{bulletin.domaine}</h3>
                <p className="card-text">Note : {bulletin.note}</p>
                <p className="card-text">Ponctualité : {bulletin.ponctualite}</p>
                <p className="card-text">Assiduité : {bulletin.assiduite}</p>
                <p className="card-text">Notes :
                  <br />
                  - Examen : {bulletin.notes.examen}
                  <br />
                  - Projet : {bulletin.notes.projet}
                  <br />
                  - Devoirs : {bulletin.notes.devoirs}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p>Moyenne générale : {moyenneGenerale.toFixed(2)}</p>
        <p>Appréciation des professeurs : {appreciation}</p>
        <p>Décision : {moyenneGenerale >= 10 ? 'Passer' : 'Redoubler'}</p>
      </div>
    </div>
  );
};

export default BulletinEtudiant;
