import Card from 'react-bootstrap/Card';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { Carousel } from 'rsuite';
import { addDoc, collection, serverTimestamp,} from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { toast } from 'react-toastify';

//Composant de Cartes contenus dans la partie Livraison du coach
function CardLivraison({role, title, name, date, defaultImg, images, validation, emailStudent, nomCoach}) {
  const [show, setShow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notificationsCollection] = useState(
    collection(db, "notifications")
  );

  //Fonction pour l'ouverture du modal
  const handleClose = () => setShow(false);
  //Fonction pour la fermeture du modal
  const handleShow = () => setShow(true);

  //Fonction de notification de validation de la tache de l'étudiant
  const addMessageNotif = async() => {
    await addDoc(notificationsCollection, {
      messageForAdmin: `Félicitations!! Votre coach ${nomCoach} vient de valider votre tache sur ${title}`,
      timestamp: serverTimestamp(),
      newNotif: true,
      email: emailStudent,
    });
  }

  //Fonction de validation d'une tache
  const handleValidation = () => {
    setIsCompleted(true);
    addMessageNotif();
    toast.success('Tache validée avec succés')
  };

  const messageNotifRejectedTask = async() => {
    await addDoc(notificationsCollection, {
      messageForAdmin: `Désolé!! Votre coach ${nomCoach} vient de rejeter votre tache sur ${title}.Consigne: Tache à refaire`,
      timestamp: serverTimestamp(),
      newNotif: true,
      email: emailStudent,
    });
  }

  const handleRejectedTask = () => {
    messageNotifRejectedTask();
    toast.success('Tache rejetée avec succés')
  }


  return (
    <Card
      style={{ width: '21rem' }}
      className="cardLivraison flex-wrap bg-white shadow-4 rounded-4 mx-3 my-3"
    >
      <Card.Img variant="top" src={defaultImg} className="imgCard rounded-3" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <p>{name}</p>
        <div className="d-flex justify-content-between">
          <i
            className="bi bi-eye-fill fs-3"
            onClick={handleShow}
            role="button"
            style={{color: "#3084b5"}}
          ></i>
          <span className="d-flex align-items-center">Il y'a {date}</span>
        </div>
      </Card.Body>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        className="modals"
      >
        <Modal.Header closeButton>
          <Modal.Title>Livraisons</Modal.Title>
        </Modal.Header>
        <Modal.Body className="content-modal">
          <Carousel>
            {images.map((img) => (
              <img src={img} alt='img'/>
            ))}
          </Carousel>
        </Modal.Body>
        {role && role.role === 'Coach'? 
        <Modal.Footer>
        {!isCompleted ? (
          <>
            {!validation ? (
              <Button className="border-0 d-flex justify-content-center bg-warning pe-auto" disabled>
                <Icon.PauseBtn className="fs-4 me-1" /> En cours...
              </Button>
            ) : (
              <Button className="border-0 d-flex justify-content-center bg-success" onClick={handleValidation}>
                Valider
              </Button>
            )}
            <Button className="bg-danger border-0" onClick={handleRejectedTask}>Rejeter</Button>
          </>
        ) : (
          <Button className="bg-secondary border-0 pe-auto " disabled><Icon.Check2Square className="fs-4 me-1" /> Validée</Button>
        )}
      </Modal.Footer> : ""}
      </Modal>
    </Card>
  );
}

export default CardLivraison;
