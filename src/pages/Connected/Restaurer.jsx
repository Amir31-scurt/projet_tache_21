import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase-config";

// Méthode principale
const Restaurer = ({ setShowRestaurerModal }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const defaultValues = {
    email: "",
  };

  // Contrôle des champs
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  // Soummission du formulaire pour inscrire
  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      setFormData(data);
      setShowMessage(true);
      reset();
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  // Modal de validation
  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="Fermer"
        className="p-button-text text-light rounded-pill"
        autoFocus
        onClick={() => {
          setShowRestaurerModal(false);
          setShowMessage(false);
        }}
        style={{ backgroundColor: "#3084b5" }}
      />
    </div>
  );

  // Affichage
  return (
    <>
      <Dialog
        visible={showMessage}
        onHide={() => {
          setShowMessage(false);
          setShowRestaurerModal(false);
        }}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex justify-content-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Restauration réussie!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Le mot de passe de votre compte a été restauré. Veuillez consulter
            votre adresse mail {""}
            <b>{formData.email}</b> pour créer un nouveau.
          </p>
        </div>
      </Dialog>
      <div className="flex justify-content-center restaurer">
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "L'email est obligatoire.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Adresse email invalide. Ex: example@email.com",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("email")}
            </div>
            <Button
              type="submit"
              label="Restaurer"
              className="rounded-pill text-light"
              style={{ backgroundColor: "#3084b5" }}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Restaurer;
