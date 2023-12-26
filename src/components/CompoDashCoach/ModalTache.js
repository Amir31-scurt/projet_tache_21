import React from "react";

import { Button, Modal } from "react-bootstrap";
function ModalTache() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Modal show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title data-aos="fade-left"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="content-modal"></Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} className="text-white bg-secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalTache;
