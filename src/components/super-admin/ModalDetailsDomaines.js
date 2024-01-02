import { Modal } from "react-bootstrap";
const ModalDetailsDomaines = ({ show, handleClose, selectedDomaine }) => {
  return (
    <Modal show={show} onHide={handleClose} className="text-start">
      <Modal.Header closeButton>
        <Modal.Title>Détails du domaine</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {selectedDomaine && (
          <div>
            <p>
              <span className="fw-bold">Domaine : </span>
              {selectedDomaine.domaine}
            </p>
            <p>
              <span className="fw-bold">Sous Domaines : </span>
              {Object.keys(selectedDomaine.sousDomaines || {}).map((nomSousDomaine, index) => (
                  <span>{nomSousDomaine} , </span>
                ))}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default ModalDetailsDomaines;
