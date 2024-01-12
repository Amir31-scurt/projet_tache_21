import React, { useState, useEffect, useContext } from "react";
import CardLivraison from "./CompoDashCoach/CardLivraison";
import FilterStudents from "./CompoDashCoach/FiterStudents";
import { EmailContext } from "../contexte/EmailContexte";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { queries } from "@testing-library/react";

function ContentCardLivraison() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);
  const [publication, setPublication] = useState([]);
  const [userFiltrer, setUserFiltrer] = useState()
  const [filtreActive, setFiltreActive ] = useState(false)

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

  const handleDisplay = (valeur) => {
    if(valeur){
    const q = query(collection(db, "publication"), where("nom", "==", valeur));
    console.log("Essaie d'affichage de la valeur: ", valeur)
    console.log("Essaie d'affichage du type de la valeur: ", typeof valeur)
    try{
      onSnapshot(q, (snapshot) => {
        const queries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserFiltrer(queries);
      setFiltreActive(true);
      })
    } catch{
        setFiltreActive(false)
      }
    } 
    // else if(valeur === null)
    else{
      console.log("La valeur est indéfinie")
      setFiltreActive(false)
    }
    console.log(userFiltrer)
  }

  const roleUser = users.find((user) => user.email === email);
  return ( 
    <div>
      {roleUser && roleUser.role === "Coach" ? <FilterStudents handleDisplay={handleDisplay} /> : ""}
     { console.log("Queries Dans le composant ContentCardLivraison",queries) }
     { console.log("UserFiltrer Dans le composant ContentCardLivraison",userFiltrer) }
      <div className="d-flex justify-content-center flex-wrap">
        {roleUser && roleUser.role === "Coach" ? (
          !filtreActive ? 
          (publication.map((pub) => (
            <CardLivraison
              role={roleUser}
              name={pub.nom}
              title={pub.cours}
              defaultImg={pub.images[0]}
              images={pub.images}
              validation={pub.finish}
              date={pub.date}
            />
          ))) : 
          (userFiltrer?.map((qr) => (
            <CardLivraison
              role={roleUser}
              name={qr.nom}
              title={qr.cours}
              defaultImg={qr.images[0]}
              images={qr.images}
              validation={qr.finish}
              date={qr.date}
            />
          )))
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
