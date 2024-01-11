import React, { useState, useEffect, useContext } from "react";
import CardLivraison from "./CompoDashCoach/CardLivraison";
import FilterStudents from "./CompoDashCoach/FiterStudents";
import { EmailContext } from "../contexte/EmailContexte";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

function ContentCardLivraison() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);
  const [publication, setPublication] = useState([]);
  const [coachs, setCoachs] = useState([]);

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
      collection(db, "publish"),
      (snapshot) => {
        const updatedPublication = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublication(updatedPublication);
      }
    );
    const coachs = onSnapshot(
      query(collection(db, "utilisateurs"), where("role", "==" , "Coach")),
      (snapshot) => {
        const updatedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoachs(updatedUsers);
      }
    );

    return () => {
      usersStudentsUnsub();
      publications();
      coachs();
    };
  }, []);
  const roleUser = users.find((user) => user.email === email);
  const coachStudents = roleUser && roleUser.role === "Coach" ? roleUser.etudiants : [];
  const filteredPublications = publication.filter((pubs) => coachStudents.includes(pubs.nom));
  
  const renderedCards = filteredPublications.map((pub) => {
    const dateToCompare = pub.date && pub.date.toDate && pub.date.toDate() instanceof Date
      ? pub.date.toDate()
      : null;
    const daysDifference = dateToCompare
      ? differenceInDays(new Date(), dateToCompare)
      : null;
  
    let displayDifference;
  
    if (daysDifference > 0) {
      displayDifference = `${daysDifference} jour${daysDifference !== 1 ? "s" : ""}`;
    } else {
      const hoursDifference = Math.abs(differenceInHours(new Date(), dateToCompare));
      const minutesDifference = Math.abs(differenceInMinutes(new Date(), dateToCompare));
  
      if (hoursDifference > 0) {
        displayDifference = `${hoursDifference} heure${hoursDifference !== 1 ? "s" : ""}`;
      } else {
        displayDifference = `${minutesDifference} minute${minutesDifference !== 1 ? "s" : ""}`;
      }
    }
  
    return (
      <CardLivraison
        role={roleUser}
        name={pub.nom}
        title={pub.cours}
        defaultImg={pub.images[0]}
        images={pub.images}
        validation={pub.finish}
        date={displayDifference}
      />
    );
  });
  

    return (
    <div>
      {/*---------------Affichage filtre coté coach----------*/}
      {roleUser && roleUser.role === "Coach" ? <FilterStudents /> : ""}
      {/*---------------Affichage carte livraison------------*/}
      <div className="d-flex justify-content-center flex-wrap">
        {renderedCards.length > 0 ? (
          renderedCards
        )
          : roleUser &&
            roleUser.role === "Étudiant" &&
            (publication.filter((pubs) => pubs.email === roleUser.email)
              .length > 0 ? (
              publication
                .filter((pubs) => pubs.email === roleUser.email)
                .map((pub) => {
                  const dateToCompare =
                    pub.date &&
                    pub.date.toDate &&
                    pub.date.toDate() instanceof Date
                      ? pub.date.toDate()
                      : null;
                  const daysDifference = dateToCompare
                    ? differenceInDays(new Date(), dateToCompare)
                    : null;

                  let displayDifference;

                  if (daysDifference > 0) {
                    displayDifference = `${daysDifference} jour${
                      daysDifference !== 1 ? "s" : ""
                    }`;
                  } else {
                    const hoursDifference = Math.abs(
                      differenceInHours(new Date(), dateToCompare)
                    );
                    const minutesDifference = Math.abs(
                      differenceInMinutes(new Date(), dateToCompare)
                    );

                    if (hoursDifference > 0) {
                      displayDifference = `${hoursDifference} heure${
                        hoursDifference !== 1 ? "s" : ""
                      }`;
                    } else {
                      displayDifference = `${minutesDifference} minute${
                        minutesDifference !== 1 ? "s" : ""
                      }`;
                    }
                  }

                  return (
                    <CardLivraison
                      role={roleUser}
                      name={pub.nom}
                      title={pub.cours}
                      defaultImg={pub.images[0]}
                      images={pub.images}
                      validation={pub.finish}
                      date={displayDifference}
                    />
                  );
                })
            ) : (
              <h2>Aucune livraison enregistrée</h2>
            ))}
      </div>
    </div>
  );
}

export default ContentCardLivraison;
