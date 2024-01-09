import React, { useState, useEffect, useContext } from "react";
import CardLivraison from "./CompoDashCoach/CardLivraison";
import FilterStudents from "./CompoDashCoach/FiterStudents";
import { EmailContext } from "../contexte/EmailContexte";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";


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
          publication.map((pub) => {
            const dateToCompare = pub.date && pub.date.toDate && pub.date.toDate() instanceof Date ? pub.date.toDate() : null;
            const daysDifference = dateToCompare ? differenceInDays(new Date(), dateToCompare) : null;
          
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
                daysDifference={daysDifference}  // Nouvelle prop pour la différence en jours
              />
            );
          })
          
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
