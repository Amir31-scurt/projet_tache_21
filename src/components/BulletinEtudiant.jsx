import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../utils/auth";

const BulletinEtudiant = () => {
  // Utilisation de useAuth 
  const { user } = useAuth(); 

  // States pour stocker la liste des étudiants, l'étudiant sélectionné, et les informations du bulletin
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
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

  // Effet pour récupérer la liste des étudiants 
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersQuery = query(collection(db, "utilisateurs"), where("role", "==", "Étudiant"));
        const usersSnapshot = await getDocs(usersQuery);
        const userList = usersSnapshot.docs.map((doc) => ({
          userId: doc.id, 
          name: doc.data().name, // Assurez-vous d'ajuster cela en fonction de la structure de vos données
        }));
        setStudents(userList);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);


  // fonction de changement de l'étudiant sélectionné
  const handleChangeStudent = (e) => {
    const selectedValue = e.target.value;
    console.log("ID :", selectedValue);

    // Obtenir les données de l'étudiant 
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
        examen: 0,
        projet: 0,
        devoirs: 0,
      },
      appreciation: "",
    });
  };

  // fonction de changement pour les champs 
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

  //Fonction pour sauvegarder le bulletin
  const handleSave = async () => {
    try {
      // Vérifier si un utilisateur est connecté
      if (!user) {
        toast.warning("Veuillez vous connecter.");
        return;
      }

      const studentId = selectedStudent;

      // Vérifier si un bulletin existe déjà pour cet étudiant
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
        notes: bulletinInfo.notes,
        appreciation: bulletinInfo.appreciation,
      };

      console.log("Données du bulletin à enregistrer :", bulletinData);

      // Ajouter les données du bulletin à la collection "bulletins"
      await addDoc(collection(db, "bulletins"), bulletinData);

      console.log("Bulletin enregistré avec succès!");
      toast.success("Bulletin enregistré avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bulletin :", error);
      toast.error(
        "Une erreur s'est produite lors de l'enregistrement du bulletin."
      );
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
              <h4>Notes de l'étudiant :</h4>
              <div className="form-group">
                <label htmlFor="javascript">JavaScript :</label>
                <select
                  id="javascript"
                  name="javascript"
                  value={bulletinInfo.notes.javascript}
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
              <div className="form-group">
                <label htmlFor="flutter">Flutter :</label>
                <select
                  id="flutter"
                  name="flutter"
                  value={bulletinInfo.notes.flutter}
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
              <div className="form-group">
                <label htmlFor="laravel">Laravel :</label>
                <select
                  id="laravel"
                  name="laravel"
                  value={bulletinInfo.notes.laravel}
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
              <div className="form-group">
                <label htmlFor="examen">Notes Examen :</label>
                <select
                  id="examen"
                  name="examen"
                  value={bulletinInfo.notes.examen}
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
              <div className="form-group">
                <label htmlFor="projet">Notes Projet :</label>
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
              <div className="form-group">
                <label htmlFor="devoirs">Notes Devoirs :</label>
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
