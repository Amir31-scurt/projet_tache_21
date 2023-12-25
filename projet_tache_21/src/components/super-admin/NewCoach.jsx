import { useState } from "react";
import { Form, Button, Modal, SelectPicker } from "rsuite";

const selectData = ["Eugenia", "Bryan", "Linda", "Nancy", "Lloyd", "Alice"].map(
  (item) => ({
    label: item,
    value: item,
  })
);

// Fonction principale
const NewCoach = () => {
  const [open, setOpen] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Méthode pour fermer le modal
  const handleClose = () => {
    setOpen(false);
  };
  // Méthode pour ouvrir le modal
  const handleOpen = () => {
    setOpen(true);
  };

  // L'affichage
  return (
    <>
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId="name-9">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="name" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="email-9">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="password-9">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group controlId="select-10">
              <Form.ControlLabel>SelectPicker</Form.ControlLabel>
              <Form.Control
                name="select"
                data={selectData}
                accepter={SelectPicker}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Button onClick={handleOpen}>New User</Button>
    </>
  );
};

export default NewCoach;
