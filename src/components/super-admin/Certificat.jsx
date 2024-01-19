/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { db } from "../../config/firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import CertificateDisplay from "./CertificatDisplay";
import html2pdf from "html2pdf.js";
import Table from "./Table";
import { format } from "date-fns";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";

// Méthode principale
const ReactHookFormDemo = () => {
  const [domain, setDomain] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const mentions = ["Excellent", "Bien", "Assez Bien"];
  const [showMessage, setShowMessage] = useState(false);
  const [certificationsData, setCertificationsData] = useState([]);
  const [isCertificateDownloaded, setIsCertificateDownloaded] = useState(false);
  const [user, setUser] = useState([]);
  const [notificationsCollection] = useState(
    collection(db, "notifications")
  );


  const [formData, setFormData] = useState({
    role: "",
    domain: "",
    mention: "",
  });
  const defaultValues = {
    accept: false,
    isCertified: false,
  };
  const [visible, setVisible] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  // Chargement des étudiants certifiés au montage
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const certificationsRef = collection(db, "certifications");

        // Utilisation de onSnapshot pour obtenir des mises à jour en temps réel
        const unsubscribe = onSnapshot(certificationsRef, (snapshot) => {
          const certificationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCertificationsData(certificationsData);
        });

        const userData = onSnapshot(
          query(collection(db, "utilisateurs"), where("role", "==" , "Étudiant")),
          (snapshot) => {
            const updatedUsers = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUser(updatedUsers);
          }
        );

        return () => {
          unsubscribe();
          userData();
        };
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des certifications:",
          error
        );
      }
    };

    fetchCertifications();
  }, []);

  // Création de la collection "certifications" pour stocker les données de la certification
  const createCertification = async (certificationData) => {
    try {
      const certificationsRef = collection(db, "certifications");
      await addDoc(certificationsRef, certificationData);
      console.log("Certification ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la certification:", error);
    }
  };

  // Soumission des champs
  const onSubmit = async(data) => {
    // Vérification si l'étudiant est déjà certifié
    const isStudentCertified = certificationsData.some(
      (certification) =>
        certification.role === data.role &&
        certification.domain === data.domain &&
        certification.mention === data.mention
    );

    if (isStudentCertified) {
      alert("L'étudiant est déjà certifié.");
      return;
    }

    setFormData(data);
    setShowMessage(true);

    // Création de la certification dans Firestore
    const certificationData = {
      role: data.role,
      domain: data.domain,
      mention: data.mention,
      date: format(data.date, "dd/MM/yyyy"),
      accepted: data.accept,
    };

    createCertification(certificationData);

    const studentDoc = user ? user.find((us) => us.name === data.role) : "";

    const notificationMessage = `Félicitaions!! Vous avez terminé votre programme avec succès ${data.domain}`
    const notificationMessageCoach = `Votre étudiant ${data.role} vient d'être certifié dans le domaine ${data.domain} avec une mention ${data.mention}`
    await addDoc(notificationsCollection, {
      messageForAdmin: notificationMessage,
      timestamp: serverTimestamp(),
      newNotif: true,
      email: studentDoc.email,
    });

    await addDoc(notificationsCollection, {
      messageForAdmin: notificationMessageCoach,
      timestamp: serverTimestamp(),
      newNotif: true,
      email: studentDoc.emailCoach,
    });

    reset();
    setVisible(false);
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  // Récupérer les domaines
  const fetchDomains = async () => {
    try {
      const domainsSnapshot = await getDocs(collection(db, "domaines"));
      const domainData = domainsSnapshot.docs.map((doc) => doc.data().domaine);
      setDomain(domainData);
    } catch (error) {
      console.error("Erreur lors de la récupération des domaines:", error);
    }
  };

  // Récupérer les utilisateurs avec le rôle "étudiant" depuis Firestore
  const fetchStudents = async () => {
    try {
      const usersSnapshot = await getDocs(
        query(collection(db, "utilisateurs"), where("role", "==", "Étudiant"))
      );
      const studentData = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      // Mise à jour du tableau "role" avec les noms des étudiants
      const studentRoles = studentData.map((student) => student.name);
      setRoleOptions(studentRoles);

      // Mettre à jour les options du formulaire avec les utilisateurs étudiants
      setFormData((prevData) => ({
        ...prevData,
        students: studentData,
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs étudiants:",
        error
      );
    }
  };

  // CHargement au montage des domaines et de la liste des étudiants
  useEffect(() => {
    fetchDomains();
    fetchStudents();
  }, []);

  // Téléchargement du pdf
  const downloadCertificate = () => {
    const certificateContainer = document.getElementById("certificate-display");
    if (certificateContainer) {
      html2pdf(certificateContainer, {
        filename: "certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        margin: [0, 0],
        pagebreak: { mode: "css", avoid: ".p-col, .p-row" },
      });
    }

    setIsCertificateDownloaded(true);
  };

  // Méthode principale
  return (
    <div className="form-demo d-flex flex-column gap-5">
      <Button
        onClick={() => setVisible(true)}
        style={{ backgroundColor: "#3084b5" }}
        className={"d-flex mx-auto text-white"}
      >
        <AddIcon />
      </Button>
      <Dialog
        header="Formulaire de Certification"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="flex justify-content-center">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
              <div className="field">
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-envelope" />
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "L'étudiant est obligatoire." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.role}
                        {...field}
                        options={roleOptions.map((r) => ({
                          label: r,
                          value: r,
                        }))}
                        placeholder="Choisissez l'étudiant"
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  <label
                    htmlFor="role"
                    className={classNames({ "p-error": !!errors.role })}
                  >
                    Étudiant
                  </label>
                </span>
                {getFormErrorMessage("role")}
              </div>
              <div className="field">
                <span className="p-float-label">
                  <Controller
                    name="domain"
                    control={control}
                    rules={{ required: "Le domaine est obligatoire." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.domain}
                        {...field}
                        options={domain.map((r) => ({ label: r, value: r }))}
                        placeholder="Choisissez le domaine"
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  <label
                    htmlFor="role"
                    className={classNames({ "p-error": errors.domain })}
                  >
                    Domaine
                  </label>
                </span>
                {getFormErrorMessage("domain")}
              </div>
              <div className="field">
                <span className="p-float-label">
                  <Controller
                    name="mention"
                    control={control}
                    rules={{ required: "La mention est obligatoire." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.mention}
                        {...field}
                        options={mentions.map((r) => ({ label: r, value: r }))}
                        placeholder="Choisissez la mention"
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  <label
                    htmlFor="mention"
                    className={classNames({ "p-error": errors.mention })}
                  >
                    Mention
                  </label>
                </span>
                {getFormErrorMessage("mention")}
              </div>
              <div className="field">
                <span className="p-float-label">
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "La date est obligatoire." }}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.date}
                        {...field}
                        showIcon
                        dateFormat="dd/mm/yy"
                        placeholder="Choisissez la date"
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  <label
                    htmlFor="date"
                    className={classNames({ "p-error": errors.date })}
                  >
                    Date
                  </label>
                </span>
                {getFormErrorMessage("date")}
              </div>
              <div className="field-checkbox">
                <Controller
                  name="accept"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="accept"
                  className={classNames({ "p-error": errors.accept })}
                >
                  Confirmez-vous vouloir certifier cet étudiant ? Si oui, cochez
                  la cage !
                </label>
              </div>
              <Button
                type="submit"
                label="Certifier"
                className="mt-2"
                style={{ backgroundColor: "#3084b5", color: "#fff" }}
                icon="pi pi-check"
              />
            </form>
          </div>
        </div>
      </Dialog>
      <div>
        <div>
          {showMessage && !isCertificateDownloaded && (
            <CertificateDisplay formData={formData} />
          )}
        </div>
        <Button
          type="button"
          onClick={() => {
            setVisible(false);
            downloadCertificate();
          }}
          className="mx-3"
          style={{ backgroundColor: "#48a93c", color: "#fff" }}
        >
          <FileDownloadIcon />
        </Button>
        <Table certificationsData={certificationsData} />
      </div>
    </div>
  );
};

export default ReactHookFormDemo;
