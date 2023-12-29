import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// import { useState, useEffect, useCallback } from "react";
import { db, storage } from "./firebase-config";
import Domaine from "./Domaine";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const FormikDoc = () => {
  const toast = useRef(null);
  const [showSousDomainesInput, setShowSousDomainesInput] = useState(false);
  const [sousDomainesList, setSousDomainesList] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [isAdding, setIsAdding] = useState(true);

  const toggleSousDomainesInput = () => {
    setShowSousDomainesInput((prev) => !prev);
  };

  const loadDomaines = useCallback(async () => {
    try {
      const domaineCollection = collection(db, "domaines");
      const snapshot = await getDocs(domaineCollection);
      const Data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDomaines(Data);
    } catch (error) {
      console.error("Error loading books:", error);
      alert(
        "Erreur de chargement. Veuillez vérifier votre connexion internet!"
      );
    }
  }, []);
  useEffect(() => {
    loadDomaines();
  }, [loadDomaines]);

  const archive = useCallback(
    async (domaineId) => {
      try {
        const selectDomaine = domaines.find((book) => book.id === domaineId);
        if (!selectDomaine) {
          console.error("No selected book to archive.");
          return;
        }

        const updatedDomaineData = {
          ...selectDomaine,
          archived: !selectDomaine.archived,
        };

        await updateDoc(doc(db, "domaines", domaineId), updatedDomaineData);
        setDomaines((prevBooks) =>
          prevBooks.map((domaine) =>
            domaine.id === domaineId
              ? { ...domaine, archived: !domaine.archived }
              : domaine
          )
        );
      } catch (error) {
        console.error("Error updating book:", error);
      }
    },
    [domaines, selectedDomaine, setDomaines, loadDomaines]
  );

  const show = async () => {
    const domain = formik.values.name;
    const sousDomaines = sousDomainesList.map((sousDomaine) => ({
      [sousDomaine]: { coachs: [] },
    }));

    const domainesData = Object.assign({}, ...sousDomaines);

    await addDoc(collection(db, "domaines"), {
      domaine: domain,
      sousDomaines: domainesData,
      archived: false,
    }).catch((error) => console.error("Error adding document: ", error));

    toast.current.show({
      severity: "success",
      summary: "Form Submitted",
      detail: `Domaine: ${domain}, Sous domaines: ${sousDomainesList.join(
        ", "
      )}`,
    });

    setSousDomainesList([]);
  };

  const handleEditDomaine = (domain) => {
    formik.values.name = domain.domaine;
    // Extraction des noms des sous-domaines et ajout à la liste
    const sousDomaines = Object.keys(domain.sousDomaines || {});
    setSousDomainesList(sousDomaines);
    setIsAdding(false);
    setSelectedDomaine(domain);
  };

  const handleUpdateDomaine = async () => {
    const domain = formik.values.name;
    const sousDomaines = sousDomainesList.map((sousDomaine) => ({
      [sousDomaine]: { coachs: [] },
    }));

    const domainesData = Object.assign({}, ...sousDomaines);
    if (selectedDomaine) {
      await updateDoc(doc(db, "domaines", selectedDomaine.id), {
        domaine: domain,
        sousDomaines: domainesData,
      });

      setDomaines((prevDomaines) =>
        prevDomaines.map((dom) =>
          dom.id === selectedDomaine.id
            ? {
                ...dom,
                ...{ domaine: domain, sousDomaines: domainesData },
              }
            : dom
        )
      );

      await loadDomaines();
      formik.setValues({ name: "" });
      setSousDomainesList([]);
      toast.current.show({
        severity: "success",
        summary: "Form Submitted",
        detail: `Domaine: ${domain}, Sous domaines: ${sousDomainesList.join(
          ", "
        )}`,
      });
    }
  };

  const addSousDomaine = () => {
    setSousDomainesList((prevList) => [
      ...prevList,
      formik.values.sousDomaines,
    ]);
    formik.setFieldValue("sousDomaines", "");
  };

  const removeSousDomaine = (index) => {
    const updatedList = [...sousDomainesList];
    updatedList.splice(index, 1);
    setSousDomainesList(updatedList);
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = event.files;
  
    // Assurez-vous que les fichiers ont été téléchargés
    if (uploadedFiles && uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
  
      // Téléchargez le fichier vers le stockage Firebase
      const storageRef = ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytes(storageRef, file);
  
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Gérer les étapes du téléchargement si nécessaire
        },
        (error) => {
          console.error('Erreur lors du téléchargement de l\'image :', error);
        },
        async () => {
          // Le téléchargement est terminé, obtenez le lien de téléchargement
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
          // Stockez le lien de téléchargement dans la base de données Firestore
          // ... (mettez à jour votre enregistrement Firestore avec downloadURL)
          console.log('Lien de téléchargement de l\'image :', downloadURL);
        }
      );
    }
  };

  
  

  const formik = useFormik({
    initialValues: {
      sousDomaines: "",
      name: "",
    },
    validate: (data) => {
      let errors = {};

      if (!data.sousDomaines && !data.name) {
        errors.sousDomaines = "Sous domaines is required.";
        errors.name = "Name is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      if (isAdding) {
        handleFileUpload();
        data && show();
        formik.setValues({ name: "", sousDomaines: "" });
        setShowSousDomainesInput(false);
        formik.resetForm();
      } else {
        data && handleUpdateDomaine();
      }
    },
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="card border-0 flex justify-content-center p-3 domaine">
      <Toast ref={toast} />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-column gap-2 border p-3 rounded"
      >
        <label htmlFor="name">Domaine</label>
        <InputText
          inputid="name"
          name="name"
          className={classNames({ "p-invalid": isFormFieldInvalid("name") })}
          value={formik.values.name}
          onChange={(e) => {
            formik.setFieldValue("name", e.target.value);
          }}
        />

        <label htmlFor="sousDomaines">Sous domaines</label>
        <div
          className={classNames(
            {
              "p-invalid": isFormFieldInvalid("sousDomaines"),
            },
            "border rounded d-flex justify-content-between"
          )}
        >
          <div className="sousDomaines-list d-flex align-items-center">
            {sousDomainesList.map((sousDomaine, index) => (
              <div
                key={index}
                className="mx-2 py-2 bg-light rounded-pill d-flex justify-content-between"
              >
                <div className="mx-3">{sousDomaine}</div>
                <div className="mx-3" onClick={() => removeSousDomaine(index)}>
                  <i className="pi pi-times"></i>
                </div>
              </div>
            ))}
          </div>
          <div
            className="col-1 d-flex justify-content-end"
            onClick={toggleSousDomainesInput}
          >
            <i
              className={`pi ${
                showSousDomainesInput ? "pi-minus" : "pi-plus"
              } bg-primary p-3 rounded`}
              style={{ fontSize: "1rem" }}
              role="button"
            ></i>
          </div>
        </div>

        {showSousDomainesInput && (
          <div className="p-inputgroup" style={{ width: "40%" }}>
            <InputText
              inputid="sousDomaines"
              name="sousDomaines"
              rows={4}
              cols={30}
              icon="pi pi-plus"
              className={classNames({
                "p-invalid": isFormFieldInvalid("sousDomaines"),
              })}
              value={formik.values.sousDomaines}
              onChange={(e) => {
                formik.setFieldValue("sousDomaines", e.target.value);
              }}
            />
            <Button
              label="créer"
              type="button"
              icon="pi pi-check"
              className="text-white"
              onClick={addSousDomaine}
            />
          </div>
        )}

        <div className="card">
          <FileUpload
            name="demo[]"
            url={"/api/upload"}
            multiple
            accept="image/*"
            maxFileSize={1000000}
            emptyTemplate={<p className="m-0">Image(s) choisie(s)</p>}
            onUpload={(event) => handleFileUpload(event)}
          />
        </div>

        {getFormErrorMessage("sousDomaines")}
        {getFormErrorMessage("name")}
        <Button
          label={isAdding ? "Ajouter" : "Modifier"}
          type="submit"
          icon="pi pi-check"
          className="col-md-4 text-white rounded"
        />
      </form>
      <Domaine
        domaines={domaines}
        onArchive={archive}
        onUpdateDomaine={handleEditDomaine}
      />
    </div>
  );
};

export default FormikDoc;
