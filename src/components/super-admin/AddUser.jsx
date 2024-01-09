import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import ajouter from '../../assets/images/ajouter-un-utilisateur.png';
import Inscription from '../Inscription/Inscription';

export default function AddUser() {
  const [visible, setVisible] = useState(false);
  const [dialogClass, setDialogClass] = useState('col-md-6');

  useEffect(() => {
    function handleResize() {
      // Mettre à jour la classe du Dialog en fonction de la largeur de l'écran
      if (window.innerWidth <= '1024px') {
        setDialogClass({ width: '100%' }); // Ajuster la classe pour une largeur maximale sur les petits écrans
      } else {
        setDialogClass({ width: '100%' }); // Revenir à la classe par défaut sur les écrans plus larges
      }
    }

    // Ajouter un event listener pour détecter le changement de taille de l'écran
    window.addEventListener('resize', handleResize);

    // Retirer l'event listener lorsque le composant est démonté
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        onClick={() => setVisible(true)}
        style={{ cursor: 'pointer' }}
      >
        <img
          className="rounded-pill border"
          src={ajouter}
          alt=""
          style={{ width: '30px', height: '30px' }}
        />
        <p className="m-0 px-2">Ajouter</p>
      </div>
      <div className="container-fluid">
        <div className="row">
          <Dialog
            header="Nouvelle utilisateur"
            visible={visible}
            onHide={() => setVisible(false)}
            className={dialogClass} // Utiliser la classe dynamique pour ajuster la taille du Dialog
          >
            <Inscription onRegisterSuccess={() => setVisible(false)} /> {/* Passer la fonction de fermeture du dialogue comme prop */}
          </Dialog>
        </div>
      </div>
    </div>
  );
}
