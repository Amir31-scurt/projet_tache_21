import React, { useState, useCallback, useEffect, useContext } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import CompoHtml from './compoHtml';
import { EmailContext } from '../../contexte/EmailContexte';

export default function Programme() {
  const [domaines, setDomaines] = useState([]);
  const [users, setUsers] = useState([]);
  const [studentDomaine, setStudentDomaine] = useState('');
  const { email } = useContext(EmailContext);

  const loadDomaines = useCallback(() => {
    return onSnapshot(collection(db, 'domaines'), (snapshot) => {
      const updatedDomaines = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.domaine.localeCompare(b.domaine)); // Sort domaines alphabetically
      setDomaines(updatedDomaines);
    });
  }, []);

  useEffect(() => {
    const usersStudentsUnsub = onSnapshot(
      collection(db, 'utilisateurs'),
      (snapshot) => {
        const updatedStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(updatedStudents);
      }
    );

    const domainesUnsub = loadDomaines();

    return () => {
      usersStudentsUnsub(); // Clean up the listener
      domainesUnsub();
    };
  }, [loadDomaines]);

  useEffect(() => {
    if (users.length > 0) {
      const student = users.find((user) => user.email === email);
      if (student && student.sousDomaines) {
        for (const domaine of domaines) {
          const sousDomaines = Object.keys(domaine.sousDomaines);
          const matchingSousDomaine = sousDomaines.find((sousDomaine) =>
            student.sousDomaines.includes(sousDomaine)
          );
          if (matchingSousDomaine) {
            setStudentDomaine(domaine.domaine);
            break; // Stop the loop after finding the first match
          }
        }
      }
    }
  }, [users, email, domaines]);

  if (!domaines.length) {
    return <div>Loading...</div>;
  }

  const domaineExactly = domaines.find((dom) => dom.domaine === studentDomaine);

  return (
    <div className="bg-cours">
      <div className="container ">
        <h2 className="text-start pb-4">Mon Programme - {studentDomaine}</h2>
        <div className="row d-flex m-0">
          {domaineExactly?.sousDomaines &&
            Object.entries(domaineExactly.sousDomaines).map(
              ([nomSousDomaine, sousDomaineData], index) => (
                <div className="col-md-3" key={index}>
                  <CompoHtml
                    url={sousDomaineData.url}
                    title={nomSousDomaine}
                    domaineId={domaineExactly.id}
                    sousDomaineName={nomSousDomaine}
                  />
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}
