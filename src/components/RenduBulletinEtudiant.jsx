import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import useAuth from "../utils/auth";
import jsPDF from "jspdf";
import "../App.css";

const RenduBulletinEtudiant = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user) {
          return;
        }

        const bulletinQuery = query(
          collection(db, "bulletins"),
          where("studentId", "==", user.uid)
        );
        const bulletinSnapshot = await getDocs(bulletinQuery);

        if (!bulletinSnapshot.empty) {
          const bulletinData = bulletinSnapshot.docs[0].data();

          if (
            bulletinData &&
            bulletinData.notes &&
            bulletinData.notes.sousDomaines
          ) {
            console.log(
              "Notes de chaque sous-domaine :",
              bulletinData.notes.sousDomaines
            );
          }

          setStudentData(bulletinData);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'étudiant :",
          error
        );
      }
    };

    fetchStudentData();
  }, [user]);

  const calculateOverallGrade = () => {
    if (
      !studentData ||
      !studentData.notes ||
      Object.keys(studentData.notes).length === 0
    )
      return 0;

    const { notes } = studentData;
    const totalNotes = Object.values(notes).reduce(
      (sum, note) => sum + parseInt(note, 10),
      0
    );
    const average = totalNotes / Object.keys(notes).length;
    return parseFloat(average.toFixed(2));
  };

  const determineAppreciation = (average) => {
    if (average >= 16) {
      return "Excellent Travail";
    } else if (average >= 14) {
      return "Très Bien";
    } else if (average >= 12) {
      return "Bien";
    } else {
      return "Peut mieux faire";
    }
  };

  const downloadPdf = () => {
    if (!studentData) return;

    const { studentName, number, email, address, notes } = studentData;
    const average = calculateOverallGrade();
    const appreciation = determineAppreciation(average);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(18);
    doc.text(`Bulletin de ${studentName}`, 20, 15);

    doc.setLineWidth(0.5);
    doc.line(20, 20, 190, 20);

    doc.setFontSize(12);
    doc.text(`Numéro de téléphone : ${number}`, 20, 30);
    doc.text(`Email : ${email}`, 20, 35);
    doc.text(`Adresse : ${address}`, 20, 40);

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(14);
    doc.text("Notes :", 20, 55);
    let yPosition = 60;

    Object.entries(notes).forEach(([subject, note]) => {
      doc.text(`${subject}: ${note}`, 30, yPosition);
      yPosition += 8;
    });

    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);

    yPosition += 10;
    doc.text("Moyenne :", 20, yPosition);
    doc.text(`${average}`, 30, yPosition + 5);

    doc.text("Appréciation :", 20, yPosition + 15);
    doc.text(`${appreciation}`, 30, yPosition + 20);

    doc.save("bulletin.pdf");
  };

  return (
    <div className="container mt-4">
      <div className="card p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        {studentData ? (
          <div>
            <div
              className="card-header d-flex justify-content-between align-items-center "
              style={{
                borderBottom: "2px solid #007BFF",
                backgroundColor: "white",
              }}
            >
              <h3 className="m-0">{`Bulletin de ${studentData.studentName}`}</h3>
              <button className="btn btn-info btn-sm" onClick={downloadPdf}>
                Télécharger le bulletin
              </button>
            </div>

            <div className="mt-4">
              <div>
                <h5>Informations personnelles :</h5>
                <p className="fs-6">Email : {studentData.email}</p>
                <p className="fs-6">
                  Numéro de téléphone : {studentData.number}
                </p>
                <p className="fs-6">Adresse : {studentData.address}</p>
              </div>
            </div>

            {studentData.notes && Object.keys(studentData.notes).length > 0 ? (
              <div className="mt-5">
                <h4>Notes :</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(studentData.notes).map(
                      ([subject, note], index) => (
                        <tr key={index}>
                          <td>{subject || "N/A"}</td>
                          <td>{note || "N/A"}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="mt-5">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>Moyenne :</h4>
                  <p className="fs-5">{calculateOverallGrade()}</p>
                </div>
                <div>
                  <h4>Appréciation :</h4>
                  <p className="fs-5">
                    {determineAppreciation(calculateOverallGrade())}
                  </p>
                </div>
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
