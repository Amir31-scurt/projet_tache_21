// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import image from '../../assets/images/image1.png';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import * as Icon from "react-bootstrap-icons";
import { Carousel } from 'rsuite';

//Composant de Cartes contenus dans la partie Livraison du coach
function CardLivraison({role, title, name, date, defaultImg, images, validation}) {
  const [show, setShow] = useState(false);
  

  //Fonction pour l'ouverture du modal
  const handleClose = () => setShow(false);
  //Fonction pour la fermeture du modal
  const handleShow = () => setShow(true);
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
          {!validation ?
            <Button className="border-0 d-flex justify-content-center bg-warning pe-auto" disabled><Icon.PauseBtn className='fs-4 me-1' /> En cours...</Button>:
            <Button className="border-0 d-flex justify-content-center bg-success">Valider</Button>
          }
          <Button className="bg-danger border-0">Rejeter</Button>
        </Modal.Footer> : ""}
      </Modal>
    </Card>
  );
}

export default CardLivraison;
