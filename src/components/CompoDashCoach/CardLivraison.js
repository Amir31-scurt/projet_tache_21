// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import image from '../../assets/images/image1.png';
import { Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import CarouselCard from './CarouselCard';
//Composant de Cartes contenus dans la partie Livraison du coach
function CardLivraison() {
  const [show, setShow] = useState(false);
  //Fonction pour l'ouverture du modal
  const handleClose = () => setShow(false);
  //Fonction pour la fermeture du modal
  const handleShow = () => setShow(true);
  return (
    <Card
      style={{ width: '23rem' }}
      className="cardLivraison col-md-4 mx-3 my-3"
    >
      <Card.Img variant="top" src={image} className="imgCard" />
      <Card.Body>
        <Card.Title>Tache 02 JavaScript</Card.Title>
        <p>Serigne Mourtalla Syll</p>
        <div className="d-flex justify-content-between">
          <i
            className="bi bi-eye-fill fs-3"
            onClick={handleShow}
            id="viewDetails"
            role="button"
          ></i>
          <span className="d-flex align-items-center">Il y'a 1 jour</span>
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
          <CarouselCard />
        </Modal.Body>
        <Modal.Footer>
          <Button className="border-0" style={{backgroundColor:'#48a93c'}} >Valider</Button>
          <Button className=" border-0"  style={{backgroundColor:'#3084b5'}}>Invalider</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CardLivraison;
