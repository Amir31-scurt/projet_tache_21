// // Certification.jsx
import React from 'react'
import signature from '../assets/images/signature.png'
import codeqr from '../assets/images/codeqr.png'
import school from '../assets/images/school.png'
import './Certification.css'

function Certification() {
  return (
    <div className="container my-4">
      <div className="row justify-content-center flex-wrap">
        <div className="border">
          <div class="card border-0 p-1 border-secondary shadow-5 text-center ">
            <div class="card-body  border-secondary">
              <div className="flex-column justify-content-center">
                <img className="img-fluid reduct" src={school} alt="" />
                <p className=" fs-3">Tech Genius</p>
              </div>
              <div className="mt-1">
                <h6 class="card-subtitle  fw-bolder fs-4">Oumar Ndongo</h6>
                <p>a terminé avec succes le</p>
                <p class="card-text fw-bolder fs-2">
                  Programme de Développement Web
                </p>
                <p class="card-text">
                  Certification de développeur le 20 decembre 2023
                </p>
                <p class="card-text ">représentant 1 an de formation</p>
              </div>
              <div className="d-flex justify-content-between">
                <div className="">
                  <p class=" text-center  DG">Amadou woury BAH</p>
                  <img className="img-fluid reduct" src={signature} alt="" />
                </div>
                <div className="">
                  <img className="img-fluid reduct" src={codeqr} alt="" />
                  <p className=" fs-3">Tech Genius</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certification

// import React, { useState } from "react";

// const Certificate = () => {
//   const [nomEleve, setNomEleve] = useState("Marion Carnier");
//   const [anneeScolaire, setAnneeScolaire] = useState("2023");
//   const [raisonCertificat, setRaisonCertificat] = useState(
//     "pour son engagement et son travail acharné"
//   );

//   return (
//     <div style={{ width: "600px", height: "400px" }}>
//       <div style={{ backgroundColor: "white", padding: "20px" }}>
//         <h1
//           style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}
//         >
//           Certificat d'étudiant de l'année
//         </h1>
//         <p style={{ textAlign: "center", fontSize: "18px" }}>
//           Ce certificat est décerné à {nomEleve} pour son excellence dans ses
//           études au cours de l'année scolaire {anneeScolaire}.
//         </p>
//         <p style={{ textAlign: "center", fontSize: "16px" }}>
//           {raisonCertificat}
//         </p>
//       </div>
//       <div style={{ backgroundColor: "#ccc", padding: "20px" }}>
//         <p style={{ textAlign: "center" }}>
//           [Logo de l'établissement scolaire]
//         </p>
//         <p style={{ textAlign: "center" }}>[Nom de l'établissement scolaire]</p>
//         <p style={{ textAlign: "center" }}>
//           [Adresse de l'établissement scolaire]
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Certificate;
