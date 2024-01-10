import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulletinEtudiant = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domains, setDomains] = useState([]);
  const [bulletinInfo, setBulletinInfo] = useState({
    sousDomaines: [],
    appreciation: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersQuery = query(
          collection(db, "utilisateurs"),
          where("role", "==", "Étudiant")
        );
        const usersSnapshot = await getDocs(usersQuery);
        const userList = usersSnapshot.docs.map((doc) => ({
          userId: doc.data().userId,
          name: doc.data().name,
          email: doc.data().email,
          number: doc.data().number,
          address: doc.data().address,
        }));
        setStudents(userList);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const domainsQuery = query(collection(db, "domaines"));
        const domainsSnapshot = await getDocs(domainsQuery);
        const domainList = domainsSnapshot.docs.map((doc) => ({
          id: doc.id,
          domaine: doc.data().domaine,
          sousDomaines: doc.data().sousDomaines || [],
        }));
        setDomains(domainList);

        console.log("Domaines et sous-domaines :", domainList);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    fetchDomains();
  }, []);

  const getSousDomaines = (domainId) => {
    const selectedDomainObj = domains.find((domain) => domain.id === domainId);
    return selectedDomainObj
      ? Object.keys(selectedDomainObj.sousDomaines || {})
      : [];
  };

  const handleChangeDomain = (e) => {
    const domainId = e.target.value;
    setSelectedDomain(domainId);

    const sousDomaines = getSousDomaines(domainId);

    setBulletinInfo((prevInfo) => ({
      ...prevInfo,
      sousDomaines: sousDomaines,
      address: selectedStudentData?.address || "",
      email: selectedStudentData?.email || "",
      number: selectedStudentData?.number || "",
    }));
  };

  const handleChangeStudent = (e) => {
    const selectedValue = e.target.value;
    const selectedStudentData = students.find(
      (student) => student.userId === selectedValue
    );

    console.log("ID :", selectedValue);
    console.log("Nom:", selectedStudentData?.name);

    setSelectedStudentData(selectedStudentData);

    setBulletinInfo({
      sousDomaines:[],
      appreciation: "",
      address: selectedStudentData?.address || "",
      email: selectedStudentData?.email || "",
      number: selectedStudentData?.number || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "appreciation") {
      setBulletinInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    } else {
      setBulletinInfo((prevInfo) => ({
        ...prevInfo,
        notes: {
          ...prevInfo.notes,
          [name]: parseInt(value, 10),
        },
      }));
      
    }
  };

  const handleSave = async () => {
    try {
      const studentUid = selectedStudentData?.userId;

      console.log("UID de l'étudiant sélectionné :", studentUid);

      const existingBulletinQuery = query(
        collection(db, "bulletins"),
        where("studentId", "==", studentUid)
      );

      const existingBulletinSnapshot = await getDocs(existingBulletinQuery);

      if (!existingBulletinSnapshot.empty) {
        toast.warning("Un bulletin existe déjà pour cet étudiant.");
        return;
      }

      // Récupérez les informations de l'étudiant sélectionné
      const studentName = selectedStudentData?.name || "Nom inconnu";
      const studentAddress = selectedStudentData?.address || "Adresse inconnue";
      const studentEmail = selectedStudentData?.email || "Email inconnu";
      const studentNumber = selectedStudentData?.number || "Numéro inconnu";

      console.log("Nom de l'étudiant sélectionné :", studentName);
      console.log("Adresse de l'étudiant sélectionné :", studentAddress);
      console.log("Email de l'étudiant sélectionné :", studentEmail);
      console.log("Numéro de l'étudiant sélectionné :", studentNumber);

      const notes = {};
      bulletinInfo.sousDomaines.forEach((subject) => {
        notes[subject] = bulletinInfo.notes[subject] || 0;
      });
  
   
      const bulletinData = {
        studentId: studentUid,
        studentName: studentName,
        address: studentAddress,
        email: studentEmail,
        number: studentNumber,
        notes: notes, 
        appreciation: bulletinInfo.appreciation,
      };
      

      console.log("Données du bulletin à enregistrer :", bulletinData);

      // Ajoutez les données du bulletin à la collection "bulletins"
      await addDoc(collection(db, "bulletins"), bulletinData);

      toast.success("Bulletin enregistré avec succès!");

      // Réinitialisez les états après la soumission réussie
      setSelectedStudentData(null);
      setBulletinInfo({
       sousDomaines:[],
        appreciation: "",
        address: "",
        email: "",
        number: "",
      });
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
          <div className="form-group">
            <label htmlFor="domainSelect">Choisir un domaine :</label>
            <select
              id="domainSelect"
              name="domain"
              value={selectedDomain}
              onChange={handleChangeDomain}
              className="form-control text-dark"
              style={{ color: "dark", backgroundColor: "white" }}
            >
              <option value="" disabled>
                Sélectionner un domaine
              </option>
              {domains.map((domain) => (
                <option key={domain.id} className="text-dark" value={domain.id}>
                  {domain.domaine}
                </option>
              ))}
            </select>
          </div>
          {selectedStudentData && (
            <div>
              <h4>Notes de l'étudiant :</h4>
              <div className="row mb-3">
                {bulletinInfo.sousDomaines &&
                  bulletinInfo.sousDomaines.length > 0 && (
                    <div className="col-md-6">
                      {bulletinInfo.sousDomaines.map((subject) => (
                        <div className="form-group" key={subject}>
                          <label htmlFor={subject}>
                            {subject.charAt(0).toUpperCase() + subject.slice(1)}{" "}
                            :
                          </label>
                          <select
                            id={subject}
                            name={subject}
                            value={bulletinInfo.sousDomaines[subject]}
                            onChange={handleChange}
                            className="form-control"
                          >
                            {Array.from({ length: 21 }, (_, i) => i).map(
                              (value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
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
