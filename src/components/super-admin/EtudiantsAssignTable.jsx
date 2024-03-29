
import React, { useEffect, useCallback, useState } from "react";
import { db } from "../../config/firebase-config";
import { MdDeleteOutline } from "react-icons/md";

import Table from "react-bootstrap/Table";

import {
  collection,
  onSnapshot,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

function EtudiantsAssignTable() {
  const [studentNames, setStudentNames] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const loadUsers = useCallback(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "utilisateurs"), where("role", "==", "Coach")),
      (snapshot) => {
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudentNames(updatedUsers);
      }
    );

    return () => {
      // Nettoyer le listener à la suppression du composant
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteClick = (coach) => {
    setShowConfirmation(true);
    setSelectedCoach(coach);
    setSelectedStudent(coach.etudiants.join(", "));
  };

  const handleDelete = async () => {
    if (selectedCoach && selectedStudent) {
      // Logique de suppression ici
      const coachRef = doc(db, "utilisateurs", selectedCoach.id);
      const nouveauxEtudiants = selectedCoach.etudiants.filter(
        (student) => student !== selectedStudent
      );
      await deleteDoc(coachRef);
      await collection((db,"utilisateurs").doc(selectedCoach.id).update)({
        etudiants: nouveauxEtudiants,
      });

      // Réinitialiser le coach et l'étudiant sélectionnés après la suppression
      setSelectedCoach(null);
      setSelectedStudent(null);
      setShowConfirmation(false);
      loadUsers(); // Recharger les données après la suppression
    }
  };

  return (
    <div className="">
      <div className=" my-2 text-center">
        <p className="fs-3 mb-2 fst-italic fw-bold text-dark">
          Tableau des Étudiants assignés à un coach
        </p>
      </div>
      <Table responsive className="table table-hover table-bordered">
        <thead className="border-0 table-primary">
          <tr>
            <th>Coachs</th>
            <th>Étudiants</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {studentNames
            .filter((coach) => coach.etudiants)
            .map((coach, index) => (
              <tr key={index}>
                <td className="border">{coach.name}</td>
                <td className="border w-50">{coach.etudiants.join(" , ")}</td>
                <td className="border d-flex justify-content-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(coach)}
                  >
                    <MdDeleteOutline className="fs-3"/>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {showConfirmation && (
        <div className="text-center my-3">
          <button className="btn btn-danger" onClick={handleDelete}>
            Confirmer la suppression
          </button>
        </div>
      )}
    </div>
  );
}

export default EtudiantsAssignTable;
