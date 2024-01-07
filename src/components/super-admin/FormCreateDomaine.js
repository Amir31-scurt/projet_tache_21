import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../../config/firebase-config';
import Domaine from './Domaine';
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

  const loadDomaines = useCallback(() => {
    const unsubscribe = onSnapshot(collection(db, 'domaines'), (snapshot) => {
      const updatedDomaines = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDomaines(updatedDomaines);
    });

    return () => {
      // Nettoyez le listener lors du démontage du composant
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    loadDomaines();
  }, [loadDomaines]);

  const archive = useCallback(
    async (domaineId) => {
      try {
        const selectDomaine = domaines.find((book) => book.id === domaineId);
        if (!selectDomaine) {
          console.error('No selected domaines to archive.');
          return;
        }

        const updatedDomaineData = {
          ...selectDomaine,
          archived: !selectDomaine.archived,
        };

        await updateDoc(doc(db, 'domaines', domaineId), updatedDomaineData);
        setDomaines((prevBooks) =>
          prevBooks.map((domaine) =>
            domaine.id === domaineId
              ? { ...domaine, archived: !domaine.archived }
              : domaine
          )
        );
      } catch (error) {
        console.error('Error updating book:', error);
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

    await addDoc(collection(db, 'domaines'), {
      domaine: domain,
      sousDomaines: domainesData,
      archived: false,
    }).catch((error) => console.error('Error adding document: ', error));

    toast.current.show({
      severity: 'success',
      summary: 'Form Submitted',
      detail: `Domaine: ${domain}, Sous domaines: ${sousDomainesList.join(
        ', '
      )}`,
    });
    setSousDomainesList([]);
  };

  const handleEditDomaine = (domain) => {
    formik.values.name = domain.domaine;
    // Extraction des noms des sous-domaines et ajout à la liste
    const sousDomaines = Object.keys(domain.sousDomaines || {});
    setSousDomainesList(sousDomaines);
    setShowSousDomainesInput(true);
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
      await updateDoc(doc(db, 'domaines', selectedDomaine.id), {
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
      formik.setValues({ name: '' });
      setSousDomainesList([]);
      toast.current.show({
        severity: 'success',
        summary: 'Form Submitted',
        detail: `Domaine: ${domain}, Sous domaines: ${sousDomainesList.join(
          ', '
        )}`,
      });
    }
  };

  const addSousDomaine = () => {
    setSousDomainesList((prevList) => [
      ...prevList,
      formik.values.sousDomaines,
    ]);
    formik.setFieldValue('sousDomaines', '');
  };

  const removeSousDomaine = (index) => {
    const updatedList = [...sousDomainesList];
    updatedList.splice(index, 1);
    setSousDomainesList(updatedList);
  };

  const formik = useFormik({
    initialValues: {
      sousDomaines: '',
      name: '',
    },
    validate: (data) => {
      let errors = {};
      if (isAdding && !isAdding) {
        if (!data.sousDomaines && !data.name) {
          errors.sousDomaines = 'Sous domaines is required.';
          errors.name = 'Name is required.';
        }
      }

      return errors;
    },
    onSubmit: async (data) => {
      if (isAdding) {
        data && show();
        console.log(formik.values.fileUrl);
        formik.setValues({ name: '', sousDomaines: '' });
        setShowSousDomainesInput(false);
        formik.resetForm();
      } else {
        data && handleUpdateDomaine();
        setIsAdding(true);
        setShowSousDomainesInput(false);
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
    <div className="card border-0 d-flex justify-content-center p-3 domaine">
      <Toast ref={toast} />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-column gap-2 border p-3 rounded"
      >
        <label htmlFor="name">Domaine</label>
        <InputText
          inputid="name"
          name="name"
          className={classNames({ 'p-invalid': isFormFieldInvalid('name') })}
          value={formik.values.name}
          onChange={(e) => {
            formik.setFieldValue('name', e.target.value);
          }}
        />

        <label htmlFor="sousDomaines">Sous domaines</label>
        <div
          className={classNames(
            {
              'p-invalid': isFormFieldInvalid('sousDomaines'),
            },
            'border rounded d-flex justify-content-between'
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
                showSousDomainesInput ? 'pi-minus' : 'pi-plus'
              } p-3 rounded`}
              style={{ fontSize: '1rem', backgroundColor: "#3084b5", color: "#fff"}}
              role="button"
            ></i>
          </div>
        </div>

        {showSousDomainesInput && (
          <div className="p-inputgroup" style={{ width: '40%' }}>
            <InputText
              inputid="sousDomaines"
              name="sousDomaines"
              rows={4}
              cols={30}
              icon="pi pi-plus"
              className={classNames({
                'p-invalid': isFormFieldInvalid('sousDomaines'),
              })}
              value={formik.values.sousDomaines}
              onChange={(e) => {
                formik.setFieldValue('sousDomaines', e.target.value);
              }}
            />
            <Button
              label="créer"
              type="button"
              icon="pi pi-check"
              className="text-white"
              onClick={addSousDomaine}
              style={{backgroundColor: "#3084b5"}}
            />
          </div>
        )}
        {getFormErrorMessage('sousDomaines')}
        {getFormErrorMessage('name')}
        <Button
          label={isAdding ? 'Ajouter' : 'Modifier'}
          type="submit"
          icon="pi pi-check"
          style={{ backgroundColor: '#3084b5' }}
          className={
            isAdding
              ? 'col-md-4 text-white rounded'
              : 'col-md-4 text-white rounded bg-warning'
          }
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
