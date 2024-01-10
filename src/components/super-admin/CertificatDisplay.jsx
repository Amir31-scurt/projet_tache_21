import React, { useRef } from 'react';
import { format } from 'date-fns';
import signature from '../../assets/images/signature.png';
import codeqr from '../../assets/images/codeqr.png';
import gandal from '../../assets/images/logo2.png';

// Méthode principale
const CertificateDisplay = ({ formData }) => {
  const certificateRef = useRef();

  const formattedDate = formData.date
    ? format(formData.date, 'dd/MM/yyyy')
    : '';

  // L'affichage
  return (
    <div
      className="certificate-display"
      id="certificate-display"
      ref={certificateRef}
    >
      <div className="container-fluid">
        <div className="row justify-content-center flex-wrap">
          <div className="col-md-6">
            <div className="card p-4 border-0 shadow-5">
              <div className="card-body dash">
                <div className="text-center">
                  <h3>Certificat de fin de formation</h3>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    {' '}
                    <div className="mb-4">
                      <img className="reduct" src={gandal} alt="Gaandal-Logo" />
                      <h3 className="NomDeLecole" style={{ color: '#3084b5' }}>
                        Gaandal
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-3">
                  <h3 className="card-subtitle fw-bold pb-3">
                    {formData.role}
                  </h3>
                  <p className="card-text">
                    A terminé avec succès le programme de{' '}
                    <span className="fw-bold">{formData.domain}</span>
                  </p>
                  <p className="card-text">
                    Terminant ainsi avec la mention{' '}
                    <span className="fw-bold">{formData.mention}</span>
                  </p>
                  <p className="card-text">
                    Certification obtenue le{' '}
                    <span className="fw-bold">{formattedDate}</span>
                  </p>
                  <p className="card-text">
                    Nous lui disons félicitations pour sa réussite et lui
                    souhaitons bonne chance !
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="text-center">
                    <h6 className="fw-bold">Le Directeur Général</h6>
                    <img
                      className="img-fluid ajout"
                      src={signature}
                      alt="Director's Signature"
                    />
                    <h5 className="fw-bold">Amadou Oury Bah</h5>
                  </div>
                  <div>
                    <img
                      className="img-fluid ajout"
                      src={codeqr}
                      alt="QR Code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDisplay;
