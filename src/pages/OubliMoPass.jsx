import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export default function OubliMoPass() {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      alert("Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.");
      setForgotPasswordEmail("");
      // Fermer le modal après la soumission réussie
      setIsModalOpen(false);
    } catch (error) {
      alert("Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div className={`container ${isModalOpen ? 'd-block' : 'd-none'}`}>
      <div className="row justify-content-center">
        <div class="col-md-6 mt-5  first">
          <div class="card-body  p-3  text-center text-white">
            <h2 class="fw-bold text-dark mb-5">Mot de passe Oublié?</h2>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <div class="form-outline text-start mb-4">
                <input
                  type="email"
                  id="email"
                  class="form-control p-2"
                  required
                  placeholder="Saisissez votre mail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>
              {/* <!-- Submit button --> */}
              <div className="text-end justify-content-between">
                <button type="button" class="btn btn-block  btn-secondary ">
                  <Link to="/connexion" className='text-decoration-none text-white'>Fermer</Link>
                </button>
                <button type="submit" className="btn but btn-block  text-white">
                  Envoyer
                </button>
                {/* <!-- Register buttons --> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
