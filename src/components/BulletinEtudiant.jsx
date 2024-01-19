import React from 'react';
import { FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';

const BulletinEtudiant = () => {
  const studentInfo = {
    nom: 'Moha',
    prenom: 'Meed',
    email: 'meed@gmail.com',
    numero: '77-777-77-77',
    domaine: 'Programmation',
    coach: 'Kalika',
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

  const moyenneGenerale = calculerMoyenne(
    bulletins.map((bulletin) => bulletin.notes.examen)
  );

  const choisirAppreciation = (moyenne) => {
    if (moyenne >= 16) {
      return 'Très bien, excellent travail !';
    } else if (moyenne >= 12) {
      return 'Bien, continuez vos efforts.';
    } else {
      return 'Peut faire mieux, travaillons ensemble pour améliorer.';
    }
  };

  const appreciation = choisirAppreciation(moyenneGenerale);

  const handleDownload = () => {
    const pdf = new jsPDF();

    // En tete
    pdf.text("Bulletin de l'étudiant", 15, 15);

    // Infos de l'etudiant
    pdf.text(`Nom: ${studentInfo.nom}`, 15, 30);
    pdf.text(`Prénom: ${studentInfo.prenom}`, 15, 45);
    pdf.text(`Email: ${studentInfo.email}`, 15, 60);
    pdf.text(`Domaine: ${studentInfo.domaine}`, 15, 75);

    // Bulletin
    let yOffset = 90;
    bulletins.forEach((bulletin, index) => {
      pdf.text(`Domaine: ${bulletin.domaine}`, 15, yOffset);
      pdf.text(`Note : ${bulletin.note}`, 15, yOffset + 10);

      if (['JavaScript', 'Laravel', 'Flutter'].includes(bulletin.domaine)) {
        pdf.text(
          `Notes : Examen: ${bulletin.notes.examen}, Projet: ${bulletin.notes.projet}, Devoirs: ${bulletin.notes.devoirs}`,
          15,
          yOffset + 20
        );
      }

      yOffset += 40;
    });

    // Infos
    pdf.text(`Moyenne générale : ${moyenneGenerale.toFixed(2)}`, 15, yOffset);
    pdf.text(
      `Appréciation des professeurs : ${appreciation}`,
      15,
      yOffset + 10
    );
    pdf.text(
      `Décision : ${moyenneGenerale >= 10 ? 'Passer' : 'Redoubler'}`,
      15,
      yOffset + 20
    );

    // nom du pdf
    pdf.save('bulletin_etudiant.pdf');
  };

  return (
    <div className="container mt-4" id="bulletin-container">
      <div className="letter-format p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-4 text-start">Bulletin de l'étudiant</h2>
          <button onClick={handleDownload} className="btn btn-primary mb-4">
            <FaFilePdf className="mr-2" /> Télécharger le bulletin
          </button>
        </div>
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Informations de l'étudiant</h3>
                <p className="card-text">Nom: {studentInfo.nom}</p>
                <p className="card-text">Prénom: {studentInfo.prenom}</p>
                <p className="card-text">Email: {studentInfo.email}</p>
                <p className="card-text">Numéro: {studentInfo.numero}</p>
                <p className="card-text">Domaine: {studentInfo.domaine}</p>
                <p className="card-text">Coach: {studentInfo.coach}</p>
                <p className="card-text">Trimestre: {studentInfo.trimestre}</p>
              </div>
            </div>
          </div>
          {bulletins.map((bulletin, index) => (
            <div key={index} className="col-md-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">{bulletin.domaine}</h3>
                  <p className="card-text">Note : {bulletin.note}</p>
                  <p className="card-text">
                    Ponctualité : {bulletin.ponctualite}
                  </p>
                  <p className="card-text">Assiduité : {bulletin.assiduite}</p>
                  <p className="card-text">
                    Notes :
                    <br />- Examen : {bulletin.notes.examen}
                    <br />- Projet : {bulletin.notes.projet}
                    <br />- Devoirs : {bulletin.notes.devoirs}
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
    </div>
  );
};

export default BulletinEtudiant;
