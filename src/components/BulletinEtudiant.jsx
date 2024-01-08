import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../utils/auth";

const BulletinEtudiant = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [bulletinInfo, setBulletinInfo] = useState({
    notes: {
      javascript: 0,
      flutter: 0,
      laravel: 0,
    },
    appreciation: "",
  });

   const subjectsByDomain = {
    programming: ["JavaScript", "Flutter", "Laravel"],
    design: ["Web Design", "Graphic Design", "UX/UI Design"],
    digitalMarketing: ["Social Media Marketing", "SEO", "Content Marketing"],
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersQuery = query(collection(db, "utilisateurs"), where("role", "==", "Étudiant"));
        const usersSnapshot = await getDocs(usersQuery);
        const userList = usersSnapshot.docs.map((doc) => ({
          userId: doc.id,
          name: doc.data().name,
        }));
        setStudents(userList);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  const handleChangeStudent = (e) => {
    const selectedValue = e.target.value;
    const selectedStudentData = students.find(
      (student) => student.userId === selectedValue
    );
  
    console.log("Nom:", selectedStudentData?.name);
  
    setSelectedStudent(selectedValue);
  
    setBulletinInfo({
      notes: {
        javascript: 0,
        flutter: 0,
        laravel: 0,
      },
      appreciation: "",
    });
  
    setSelectedDomain("");
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["javascript", "flutter", "laravel"].includes(name)) {
      setBulletinInfo((prevInfo) => ({
        ...prevInfo,
        notes: {
          ...prevInfo.notes,
          [name]: parseInt(value, 10),
        },
      }));
    } else {
      setBulletinInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const handleDomainChange = (e) => {
    const selectedDomainValue = e.target.value;
    setSelectedDomain(selectedDomainValue);
  };

  const handleSave = async () => {
    try {
      if (!user) {
        toast.warning("Veuillez vous connecter.");
        return;
      }

      const studentId = selectedStudent;

      const existingBulletinQuery = query(
        collection(db, 'bulletins'),
        where('studentId', '==', studentId)
      );

      const existingBulletinSnapshot = await getDocs(existingBulletinQuery);

      if (!existingBulletinSnapshot.empty) {
        toast.warning("Un bulletin existe déjà pour cet étudiant.");
        return;
      }

      const selectedStudentData = students.find(
        (student) => student.userId === studentId
      );
      const studentName = selectedStudentData?.name || "Nom inconnu";

      const bulletinData = {
        studentId: studentId,
        studentName: studentName,
        domain: selectedDomain,
        notes: bulletinInfo.notes,
        appreciation: bulletinInfo.appreciation,
      };

      await addDoc(collection(db, "bulletins"), bulletinData);

      toast.success("Bulletin enregistré avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bulletin :", error);
      toast.error("Une erreur s'est produite lors de l'enregistrement du bulletin.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="letter-format p-4">
        <h2 className="mb-4">Remplir le bulletin</h2>
        <form>
          <div className="form-group">
            <label htmlFor="studentSelect">Choisir un étudiant :</label>
            <select
              id="studentSelect"
              name="studentId"
              value={selectedStudent}
              onChange={handleChangeStudent}
              className="form-control text-dark"
              style={{ color: "black", backgroundColor: "white" }}
            >
              <option value="" disabled>
                Sélectionner un étudiant
              </option>
              {students.map((student) => (
                <option
                  key={student.userId}
                  className="text-dark"
                  value={student.userId}
                >
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          {selectedStudent && (
            <div>
              <h4>Choisir un domaine :</h4>
              <div className="form-group">
                <select
                  id="domainSelect"
                  name="domain"
                  value={selectedDomain}
                  onChange={handleDomainChange}
                  className="form-control text-dark"
                  style={{ color: "black", backgroundColor: "white" }}
                >
                  <option value="" disabled>
                    Sélectionner un domaine
                  </option>
                  <option value="programming">Programmation</option>
                  <option value="design">Design</option>
                  <option value="digitalMarketing">Marketing Digital</option>
                </select>
              </div>
              {selectedDomain && (
                <div>
                  <h4>Notes de l'étudiant :</h4>
                  {subjectsByDomain[selectedDomain].map((subject) => (
                    <div className="form-group" key={subject}>
                      <label htmlFor={subject}>{subject} :</label>
                      <select
                        id={subject}
                        name={subject.toLowerCase()} 
                        value={bulletinInfo.notes[subject.toLowerCase()]}
                        onChange={handleChange}
                        className="form-control"
                      >
                        {Array.from({ length: 21 }, (_, i) => i).map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div className="form-group">
                    <label htmlFor="appreciation">Appréciation :</label>
                    <input
                      type="text"
                      id="appreciation"
                      name="appreciation"
                      value={bulletinInfo.appreciation}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn btn-primary mt-2"
                  >
                    Enregistrer le bulletin
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BulletinEtudiant;


