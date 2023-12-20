// import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import image from "../../assets/images/image1.png";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import CarouselCard from "./CarouselCard";

function CardLivraison() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Card style={{ width: "18rem" }} className="cardLivraison">
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>Tache 02 JavaScript</Card.Title>
        <i
          className="bi bi-eye-fill text-info fs-3"
          onClick={handleShow}
          role="button"
        ></i>
      </Card.Body>
      <Modal show={show} onHide={handleClose} keyboard={false} className="modals">
        <Modal.Header closeButton>
          <Modal.Title>Livraisons</Modal.Title>
        </Modal.Header>
        <Modal.Body className="content-modal">
          <CarouselCard />
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-success border-0">Valider</Button>
          <Button className="bg-danger border-0">Invalider</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default CardLivraison;
