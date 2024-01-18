import Table from "react-bootstrap/Table";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";
import { Button } from "primereact/button";
import ModalDetailsDomaines from "./ModalDetailsDomaines";

function Domaine({domaines , onArchive, onUpdateDomaine}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDomaine, setSelectedDomaine] = useState(null);

    // Méthode pour afficher le modal
    const handleShowModal = (domaine) => {
      setSelectedDomaine(domaine);
      setShowModal(true);
    };
  
    // Méthode pour fermer le modal
    const handleCloseModal = () => {
      setSelectedDomaine(null);
      setShowModal(false);
    };

  return (
    <div className="pt-5">
      <Table responsive bordered>
        <thead className="border-0 table-primary w-100">
          <tr className="">
            <th>Domaines</th>
            <th>Sous Domaines</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {domaines.map((domaine, index) => (
            <tr key={index} className={domaine.archived ? "border-0 archived" : "border-0"}>
              <td className="border col-3">{domaine.domaine}</td>
              <td className="border">
                <div className="d-flex">
                  {domaine.sousDomaines &&
                    Object.keys(domaine.sousDomaines).map((nomSousDomaine, index) => (
                    <td key={index} className="me-3">
                      {nomSousDomaine}
                    </td>
                  ))}
                </div>
              </td>
              <td className="border col-3">
                <div className=" d-flex justify-content-center">
                  <Button className="mb-2 mx-1 bg-transparent text-info border rounded" onClick={() => handleShowModal(domaine)}>
                    <Icon.Eye />
                  </Button>
                  <Button className="mb-2 mx-1 text-primary border rounded bg-transparent" onClick={() => onUpdateDomaine(domaine)} >

                    <Icon.Pen />
                  </Button>
                  <Button
                    className="mb-2 mx-1 text-warning border rounded bg-transparent"
                    onClick={() => onArchive(domaine.id)}
                  >
                    {!domaine.archived ?
                      <Icon.Archive /> :
                      <Icon.Easel3 className="text-success" />
                    }
                    
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalDetailsDomaines
          show={showModal}
          handleClose={handleCloseModal}
          selectedDomaine={selectedDomaine}
        />
    </div>
  );
}

export default Domaine;
