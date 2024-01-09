import React, { useState, useEffect, useContext } from "react";
import CardLivraison from "./CompoDashCoach/CardLivraison";
import FilterStudents from "./CompoDashCoach/FiterStudents";
import { EmailContext } from "../contexte/EmailContexte";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";

function ContentCardLivraison() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);
  const [publication, setPublication] = useState([]);

  useEffect(() => {
    const usersStudentsUnsub = onSnapshot(
      collection(db, "utilisateurs"),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedStudents);
      }
    );
    const publications = onSnapshot(
      collection(db, "publication"),
      (snapshot) => {
        const updatedPublication = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublication(updatedPublication);
      }
    );

    return () => {
      usersStudentsUnsub();
      publications();
    };
  }, []); 

  const roleUser = users.find((user) => user.email === email);
  return (
    <div>
      {roleUser && roleUser.role === "Coach" ? <FilterStudents /> : ""}
      <div className="d-flex justify-content-center flex-wrap">
        {roleUser && roleUser.role === "Coach" ? (
          publication.map((pub) => (
            <CardLivraison
              role={roleUser}
              name={pub.nom}
              title={pub.cours}
              defaultImg={pub.images[0]}
              images={pub.images}
              validation={pub.finish}
              date={pub.date}
            />
          ))
        ) : (
          roleUser && roleUser.role === "Étudiant" && (
            publication.filter((pubs) => pubs.email === roleUser.email).length > 0 ? (
              publication
                .filter((pubs) => pubs.email === roleUser.email)
                .map((pub) => (
                  <CardLivraison
                    role={roleUser}
                    name={pub.nom}
                    title={pub.cours}
                    defaultImg={pub.images[0]}
                    images={pub.images}
                    validation={pub.finish}
                    date={pub.date}
                  />
                ))
            ) : (
              <h2>Aucune livraison enregistrée</h2>
            )
          )
        )}
      </div>
    </div>
  );
}

export default ContentCardLivraison;
