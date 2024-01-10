import React, { useState, useEffect, User } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";

const AssignTable = ({ coachId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docCoach = await getDoc(doc(db, "coaches", coachId));

        if (docCoach.exists()) {
          const dataCoach = docCoach.data();
          const studentIds = Object.keys(dataCoach.students || {});

          // Fetch student details
          const studentsData = await Promise.all(
            studentIds.map(async (studentId) => {
              const docStudent = await getDoc(doc(db, "students", studentId));
              return docStudent.data();
            })
          );

          setStudents(studentsData);
        } else {
          console.log("Coach not found");
        }
      } catch (error) {
        console.error("Error getting students for coach:", error);
      }
    };

    fetchData();
  }, [coachId]);

  return (
    <div>
      <h2>Students assigned to Coach</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Other Columns...</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.otherProperty}</td>
              {/* Add other columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignTable;
