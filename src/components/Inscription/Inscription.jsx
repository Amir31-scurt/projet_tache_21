/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../config/firebase-config";
import { Dropdown } from "primereact/dropdown";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import emailjs from "emailjs-com";

emailjs.init("iyzQvt6sAJkX_ndas");

// Composant principal
const Inscription = () => {
  const roles = ["Administrateur", "Coach", "Étudiant"];
  const [showMessage, setShowMessage] = useState(false);

  // Fonction pour générer un mot de passe aléatoire
  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  };

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    number: "",
    email: "",
    password: generateRandomPassword(),
    role: "",
    archived: false,
    active: true,
  });

  const defaultValues = {
    name: "",
    address: "",
    number: "",
    email: "",
    password: "",
    role: "",
    archived: false,
    active: true,
  };

  // Générer un nouveau mot de passe lors du montage du composant
  useEffect(() => {
    const newPassword = generateRandomPassword();
    setFormData((prevData) => ({ ...prevData, password: newPassword }));
  }, []);

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
      const randomPassword = generateRandomPassword();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      // Récupérez l'ID de l'utilisateur créé
      const userId = userCredential.user.uid;

      // Enregistrez les données dans Firestore
      await addDoc(collection(db, "utilisateurs"), {
        userId: userId,
        name: data.name,
        address: data.address,
        number: data.number,
        email: data.email,
        role: data.role,
        archived: data.archived,
        active: data.active,
        password: formData.password,
      });

      // // Créez la collection userChats
      // const userChatsCollectionRef = collection(db, "userChats");
      // const userChatDocRef = doc(userChatsCollectionRef, userId);
      // await setDoc(userChatDocRef, { chats: [] });

      setFormData(data);
      setShowMessage(true);
      reset();

      // Envoyer les identifiants par e-mail
      const templateParams = {
        to_email: data.email,
        subject: "Vos identifiants",
        message: `Bonjour ${data.name}, \n\nVotre compte a été créé avec succès. Vos identifiants sont: \nEmail: ${data.email} \nMot de passe: ${formData.password} \n\nCliquez sur le lien suivant pour accéder à notre site: https://projet-tache-21-5thn.vercel.app/`,
      };

      emailjs
        .send("service_5vkyapl", "template_3zobb4l", templateParams)
        .then((response) => {
          console.log("Email sent:", response);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  const passwordHeader = <h6>Choisissez un mot de passe</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>Au moins une minuscule</li>
        <li>Au moins une majuscule</li>
        <li>Au moins un chiffre</li>
        <li>Minimum 8 caractères</li>
      </ul>
    </React.Fragment>
  );

  return (
    <div className="form-demo">
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="center"
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
          <h5>Inscription réussie!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Vous venez de créer un compte sous le nom <b>{formData.name}</b> et
            sous l'email {""}
            <b>{formData.email}</b>.
          </p>
        </div>
      </Dialog>
      <div className="flex justify-content-center mx-auto">
        <div className="card">
          <h5 className="text-center">Inscription</h5>
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-user" />
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Le nom est obligatoire." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      placeholder="Nom"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("name")}
            </div>
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-home" />
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "L'adresse est obligatoire." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      placeholder="Adresse"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("address")}
            </div>
            <div className="field">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-phone" />
                <Controller
                  name="number"
                  control={control}
                  rules={{
                    required: "Le numéro de téléphone est obligatoire.",
                    pattern: {
                      value: /^\+(?:[0-9] ?){6,14}[0-9]$/,
                      message: "Numéro de téléphone invalide. Ex: +123456789",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.number}
                      {...field}
                      autoFocus
                      placeholder="Numéro"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("number")}
            </div>
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
                      placeholder="Émail"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("email")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Le mot de passe est obligatoire." }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      placeholder="Mot de passe"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                      value={formData.password}
                      header={passwordHeader}
                      footer={passwordFooter}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("password")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <label htmlFor="role">Rôle</label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Le rôle est obligatoire." }}
                  render={({ field, fieldState }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      options={roles.map((r) => ({ label: r, value: r }))}
                      placeholder="Sélectionnez le rôle"
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
              </span>
              {getFormErrorMessage("role")}
            </div>
            <Button
              type="submit"
              label="Inscrire"
              className="mt-2 inscributton text-light"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
