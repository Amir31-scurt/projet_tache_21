import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import useAuth from '../utils/auth';
import jsPDF from 'jspdf';
import '../App.css';

const RenduBulletinEtudiant = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user) {
          console.log("Pas d'utilisateur connecté");
          return;
        }

        console.log('ID Utilisateur :', user.uid);

        const bulletinQuery = query(collection(db, 'bulletins'), where('studentId', '==', user.uid));
        const bulletinSnapshot = await getDocs(bulletinQuery);

        if (!bulletinSnapshot.empty) {
          console.log('Bulletin Snapshot:', bulletinSnapshot.docs[0]); 
          const bulletinData = bulletinSnapshot.docs[0].data();
          console.log('Bulletin Data:', bulletinData);
          setStudentData(bulletinData);
        } else {
          console.log("Aucun bulletin trouvé pour l'ID utilisateur :", user.uid);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'étudiant :", error);
      }
    };

    fetchStudentData();
  }, [user]);

  const calculateOverallGrade = () => {
    if (!studentData) return 0;

    const { javascript, flutter, laravel, examen, projet, devoirs } = studentData.notes;
    const average = (javascript + flutter + laravel + examen + projet + devoirs) / 6;
    return parseFloat(average.toFixed(2));
  };

  const determineAppreciation = (average) => {
    if (average >= 16) {
      return 'Très bien';
    } else if (average >= 14) {
      return 'Bien';
    } else if (average >= 12) {
      return 'Assez bien';
    } else {
      return 'Peux mieux faire';
    }
  };

  const generatePdfContent = () => {
    if (!studentData) return;

    const { studentName, notes } = studentData;
    const average = calculateOverallGrade();
    const appreciation = determineAppreciation(average);
  
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', 
    });
  
    doc.setFontSize(18);
    doc.text(`Bulletin de ${studentName}`, 20, 15);
  
    doc.line(20, 20, 190, 20);
  
    doc.setFontSize(14);
    doc.text('Notes :', 20, 30);
    doc.text(`JavaScript: ${notes.javascript}`, 30, 40);
    doc.text(`Flutter: ${notes.flutter}`, 30, 50);
    doc.text(`Laravel: ${notes.laravel}`, 30, 60);
    doc.text(`Examen: ${notes.examen}`, 30, 70);
    doc.text(`Projet: ${notes.projet}`, 30, 80);
    doc.text(`Devoirs: ${notes.devoirs}`, 30, 90);
  
    doc.line(20, 100, 190, 100);
  
    doc.text('Moyenne :', 20, 110);
    doc.text(`${average}`, 30, 120);
  
    doc.text('Appréciation :', 20, 130);
    doc.text(`${appreciation}`, 30, 140);
  
    return doc;
  };

  const downloadPdf = () => {
    const pdfContent = generatePdfContent();
    pdfContent.save('bulletin.pdf');
  };

  return (
    <div className="container mt-4">
    <div className="card p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {studentData ? (
        <div>
           <div className='card-header d-flex justify-content-between align-items-center ' style={{ borderBottom: '2px solid #007BFF', backgroundColor:'white' }}>
              <h3 className="m-0">{`Bulletin de ${studentData.studentName}`}</h3>
              <button className='btn btn-info btn-sm' onClick={downloadPdf}>Télécharger le bulletin</button>
            </div>
        
          <div className='mt-3'>
            <h4>Notes :</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JavaScript</td>
                  <td>{studentData.notes.javascript}</td>
                </tr>
                <tr>
                  <td>Flutter</td>
                  <td>{studentData.notes.flutter}</td>
                </tr>
                <tr>
                  <td>Laravel</td>
                  <td>{studentData.notes.laravel}</td>
                </tr>
                <tr>
                  <td>Examen</td>
                  <td>{studentData.notes.examen}</td>
                </tr>
                <tr>
                  <td>Projet</td>
                  <td>{studentData.notes.projet}</td>
                </tr>
                <tr>
                  <td>Devoirs</td>
                  <td>{studentData.notes.devoirs}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3">
              <div>
                <h4>Moyenne :</h4>
                <p>{calculateOverallGrade()}</p>
              </div>
              <div>
                <h4>Appréciation :</h4>
                <p>{determineAppreciation(calculateOverallGrade())}</p>
              </div>
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
