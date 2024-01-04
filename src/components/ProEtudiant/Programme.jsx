import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../config/firebase-config";
import CompoHtml from "./compoHtml";
import { EmailContext } from "../../contexte/EmailContexte";

export default function Programme() {
  const [domaines, setDomaines] = useState([]);
  const [users, setUsers] = useState([]);
  let [studentDomaine, setStudentDomaine] = useState("");
  const { email, setEmail } = useContext(EmailContext);
  const loadDomaines = useCallback(() => {
    const unsubscribe = onSnapshot(collection(db, "domaines"), (snapshot) => {
      const updatedDomaines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDomaines(updatedDomaines);
    });
    const usersStudents = onSnapshot(
      collection(db, "utilisateurs"),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedStudents);
      }
    );

    return () => {
      // Nettoyez le listener lors du démontage du composant
      unsubscribe();
      usersStudents();
    };
  }, []);

  useEffect(() => {
    const studentConnected = () => {
      if (users.length > 0) {
        const student = users.find((user) => user.email === email);

        if (student && student.sousDomaines) {
          domaines.forEach((domaine) => {
            const sousDomaines = Object.keys(domaine.sousDomaines);

            // Check if any element in student.sousDomaines matches any sousDomaine in the current domaine
            const matchingSousDomaine = sousDomaines.find((sousDomaine) =>
              student.sousDomaines.includes(sousDomaine)
            );

            if (matchingSousDomaine) {
              setStudentDomaine(domaine.domaine);
              // You can do further actions based on the match
              // Add a break statement to exit the loop after the first match
              return;
            }
          });
        }
      }
    };

    loadDomaines();
    studentConnected();
  }, [loadDomaines, users, email, domaines, studentDomaine]);

  if (!domaines.length) {
    // Handle the case where domaines is still empty
    return <div>Loading...</div>;
  }

  const domaineExactly = domaines.find((dom) => dom.domaine === studentDomaine);
  return (
    <div className="bg-cours">
      <div className="container ">
        <h2 className="text-start pb-4">Mon Programme</h2>
        <div className="row d-flex m-0">
        {domaineExactly?.sousDomaines &&
          Object.entries(domaineExactly.sousDomaines).map(
            ([nomSousDomaine, sousDomaineData], index) => (
              <div className="col-md-3" key={index}>
                <CompoHtml url={sousDomaineData.url} title={nomSousDomaine} />
              </div>
            )
          )}
      </div>
      </div>
    </div>
  );
}
