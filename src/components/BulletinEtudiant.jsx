import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulletinEtudiant = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [bulletinInfo, setBulletinInfo] = useState({
    notes: {
      javascript: 0,
      flutter: 0,
      laravel: 0,
      examen: 0,
      projet: 0,
      devoirs: 0,
    },
    appreciation: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersQuery = query(collection(db, "utilisateurs"), where("role", "==", "Étudiant"));
        const usersSnapshot = await getDocs(usersQuery);
        const userList = usersSnapshot.docs.map((doc) => ({
          userId: doc.data().userId, 
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

    console.log("ID :", selectedValue);
    console.log("Nom:", selectedStudentData?.name);

    setSelectedStudentData(selectedStudentData);

    setBulletinInfo({
      notes: {
        javascript: 0,
        flutter: 0,
        laravel: 0,
        examen: 0,
        projet: 0,
        devoirs: 0,
      },
      appreciation: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "javascript",
        "flutter",
        "laravel",
        "examen",
        "projet",
        "devoirs",
      ].includes(name)
    ) {
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

  const handleSave = async () => {
    try {
   
      const studentUid = selectedStudentData?.userId;
  
      console.log("UID de l'étudiant sélectionné :", studentUid);

      const existingBulletinQuery = query(
        collection(db, 'bulletins'),
        where('studentId', '==', studentUid)
      );
  
      const existingBulletinSnapshot = await getDocs(existingBulletinQuery);
  
      if (!existingBulletinSnapshot.empty) {
        toast.warning("Un bulletin existe déjà pour cet étudiant.");
        return;
      }
  
      // Récupérez les informations de l'étudiant sélectionné
      const studentName = selectedStudentData?.name || "Nom inconnu";
  
      console.log("Nom de l'étudiant sélectionné :", studentName);
  
      //  les données du bulletin
      const bulletinData = {
        studentId: studentUid,
        studentName: studentName,
        notes: bulletinInfo.notes,
        appreciation: bulletinInfo.appreciation,
      };
  
      console.log("Données du bulletin à enregistrer :", bulletinData);
  
      // Ajoutez les données du bulletin à la collection "bulletins"
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
              value={selectedStudentData?.userId || ""}
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
          {selectedStudentData && (
            <div>
              <h4>Notes de l'étudiant :</h4>
              <div className="row mb-3">
                <div className="col-md-6">
                  {["javascript", "flutter"].map((subject) => (
                    <div className="form-group" key={subject}>
                      <label htmlFor={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)} :
                      </label>
                      <select
                        id={subject}
                        name={subject}
                        value={bulletinInfo.notes[subject]}
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
                </div>
                <div className="col-md-6">
                  {["laravel", "examen"].map((subject) => (
                    <div className="form-group" key={subject}>
                      <label htmlFor={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)} :
                      </label>
                      <select
                        id={subject}
                        name={subject}
                        value={bulletinInfo.notes[subject]}
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
                </div>
              </div>
              <div className="row ">
                <div className="col-md-6">
                  <div className="form-group" key="projet">
                    <label htmlFor="projet">
                      Projet :
                    </label>
                    <select
                      id="projet"
                      name="projet"
                      value={bulletinInfo.notes.projet}
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
                </div>
                <div className="col-md-6">
                  <div className="form-group" key="devoirs">
                    <label htmlFor="devoirs">
                      Devoirs :
                    </label>
                    <select
                      id="devoirs"
                      name="devoirs"
                      value={bulletinInfo.notes.devoirs}
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
                </div>
              </div>
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
        </form>
      </div>
    </div>
  );
};

export default BulletinEtudiant;
