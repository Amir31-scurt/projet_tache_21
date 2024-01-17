import React, { useState, useEffect, useContext } from 'react';
import CardLivraison from './CompoDashCoach/CardLivraison';
import FilterStudents from './CompoDashCoach/FiterStudents';
import { EmailContext } from '../contexte/EmailContexte';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

function ContentCardLivraison() {
  const [users, setUsers] = useState([]);
  const { email } = useContext(EmailContext);
  const [publications, setPublications] = useState([]);
  const [userFiltrer, setUserFiltrer] = useState([]);
  const [filtreActive, setFiltreActive] = useState(false);

  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubPublications = onSnapshot(
      collection(db, 'publication'),
      (snapshot) => {
        setPublications(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );

    return () => {
      unsubUsers();
      unsubPublications();
    };
  }, []);

  const roleUser = users.find((user) => user.email === email);
  const coachStudents = roleUser?.etudiants ?? [];
  const coachName = roleUser && roleUser.role === "Coach" ? roleUser.name : "";
  const filteredPublications = publications.filter((pub) =>
    coachStudents.includes(pub.nom)
  );
  
  const handleDisplay = (valeur) => {
    if (valeur) {
      const q = query(
        collection(db, 'publication'),
        where('nom', '==', valeur)
      );
      onSnapshot(
        q,
        (snapshot) => {
          const filteredData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserFiltrer(filteredData);
          setFiltreActive(true);
        },
        (error) => {
          console.error('Error fetching filtered data: ', error);
          setFiltreActive(false);
        }
      );
    } else {
      setFiltreActive(false);
    }
  };

  const renderCards = (publicationData) => {
    return publicationData.map((pub) => {
      const dateToCompare =
        pub.date?.toDate instanceof Function
          ? pub.date.toDate()
          : new Date(pub.date);
      const daysDifference = differenceInDays(new Date(), dateToCompare);
      let displayDifference;
      if (daysDifference > 0) {
        displayDifference = `${daysDifference} jour${
          daysDifference > 1 ? 's' : ''
        }`;
      } else {
        const hoursDifference = differenceInHours(new Date(), dateToCompare);
        if (hoursDifference > 0) {
          displayDifference = `${hoursDifference} heure${
            hoursDifference > 1 ? 's' : ''
          }`;
        } else {
          const minutesDifference = differenceInMinutes(
            new Date(),
            dateToCompare
          );
          displayDifference = `${minutesDifference} minute${
            minutesDifference > 1 ? 's' : ''
          }`;
        }
      }

      return pub.images.length > 0 ? (
        <CardLivraison
          role={roleUser}
          name={pub.nom}
          title={pub.cours}
          defaultImg={pub.images[0]}
          images={pub.images}
          validation={pub.finish}
          emailStudent={pub.email}
          nomCoach={coachName}
          date={displayDifference}
          idDoc={pub.id}
          valid={pub.valider}
        />
      ) : <h3 className='pt-5'>Aucune livraison enrégistrer</h3>;
    });
  };

  return (
    <div>
      {roleUser?.role === 'Coach' && (
        <FilterStudents handleDisplay={handleDisplay} />
      )}
      <div className="d-flex justify-content-center flex-wrap">
        {roleUser?.role === 'Coach'
          ? filtreActive
            ? renderCards(userFiltrer)
            : renderCards(filteredPublications)
          : roleUser?.role === 'Étudiant' &&
            renderCards(publications.filter((pub) => pub.email === email))}
      </div>
    </div>
  );
}

export default ContentCardLivraison;

