import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import useAuth from '../utils/auth';
import jsPDF from 'jspdf';

const RenduBulletinEtudiant = () => {
  // useAuth pour recuperer le user connecté
  const { user } = useAuth();
  
  // State pour stocker les données de l'étudiant
  const [studentData, setStudentData] = useState(null);

  // Effet pour récupérer les données de l'étudiant 
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Vérifier si le user est connecté
        if (!user) {
          console.log('Pad d\'utilisateur connecté');
          return;
        }

        console.log('ID Utilisateur :', user.uid);

        // Utiliser l'ID du user connecté pour récupérer le bulletin
        const bulletinQuery = query(collection(db, 'bulletins'), where('studentId', '==', user.uid));
        const bulletinSnapshot = await getDocs(bulletinQuery);

        if (!bulletinSnapshot.empty) {
          console.log('Bulletin Snapshot:', bulletinSnapshot.docs[0]); 
          const bulletinData = bulletinSnapshot.docs[0].data();
          console.log('Bulletin Data:', bulletinData);
          setStudentData(bulletinData);
        } else {
          console.log('Aucun bulletin trouvé pour l\'ID utilisateur :', user.uid);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'étudiant :', error);
      }
    };

    fetchStudentData();
  }, [user]);

  // Calcul de la moyenne générale
  const calculateOverallGrade = () => {
    const { javascript, flutter, laravel, examen, projet, devoirs } = studentData.notes;
    const average = (javascript + flutter + laravel + examen + projet + devoirs) / 6;
    return parseFloat(average.toFixed(2)); // Convertir en nombre à virgule flottante
  };

  // Détermination de l'appréciation en fonction de la moyenne
  const determineAppreciation = (average) => {
    if (average >= 16) {
      return 'Très bien';
    } else if (average >= 14) {
      return 'Bien';
    } else if (average >= 12) {
      return 'Assez bien';
    } else {
      return 'En dessous de la moyenne';
    }
  };

  // Génération du contenu du PDF
  const generatePdfContent = () => {
    const { studentName, notes } = studentData;
    const average = calculateOverallGrade();
    const appreciation = determineAppreciation(average);
  
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', 
    });
  
    // Titre
    doc.setFontSize(18);
    doc.text(`Bulletin de ${studentName}`, 20, 15);
  
    // Ligne séparatrice
    doc.line(20, 20, 190, 20);
  
    // Notes
    doc.setFontSize(14);
    doc.text('Notes :', 20, 30);
    doc.text(`JavaScript: ${notes.javascript}`, 30, 40);
    doc.text(`Flutter: ${notes.flutter}`, 30, 50);
    doc.text(`Laravel: ${notes.laravel}`, 30, 60);
    doc.text(`Examen: ${notes.examen}`, 30, 70);
    doc.text(`Projet: ${notes.projet}`, 30, 80);
    doc.text(`Devoirs: ${notes.devoirs}`, 30, 90);
  
    // Ligne séparatrice
    doc.line(20, 100, 190, 100);
  
    // Moyenne
    doc.text('Moyenne :', 20, 110);
    doc.text(`${average}`, 30, 120);
  
    // Appréciation
    doc.text('Appréciation :', 20, 130);
    doc.text(`${appreciation}`, 30, 140);
  
    return doc;
  };
  

  // Fonction pour télécharger le PDF
  const downloadPdf = () => {
    const pdfContent = generatePdfContent();
    pdfContent.save('bulletin.pdf');
  };

  return (
    <div className="container mt-4">
      <div className="letter-format p-4">
        {studentData ? (
          <div>
            <div className='d-flex justify-content-between'>
              <h3>{`Bulletin de ${studentData.studentName}`}</h3>
              <button className='btn btn-info btn-sm' onClick={downloadPdf}>Télécharger le bulletin</button>
            </div>
          
            <div className='mt-3'>
              <h4>Notes :</h4>
              <p>JavaScript: {studentData.notes.javascript}</p>
              <p>Flutter: {studentData.notes.flutter}</p>
              <p>Laravel: {studentData.notes.laravel}</p>
              <p>Examen: {studentData.notes.examen}</p>
              <p>Projet: {studentData.notes.projet}</p>
              <p>Devoirs: {studentData.notes.devoirs}</p>
            </div>
            <div>
              <h4>Moyenne :</h4>
              <p>{calculateOverallGrade()}</p>
            </div>
            <div>
              <h4>Appréciation :</h4>
              <p>{determineAppreciation(calculateOverallGrade())}</p>
            </div>
          </div>
        ) : (
          <p>Bulletin indisponible...</p>
        )}
      </div>
    </div>
  );
};

export default RenduBulletinEtudiant;
