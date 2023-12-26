import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase-config';

const OubliMoPass = () => {
  // State pour l'e-mail
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Hook de navigation
  const navigate = useNavigate();

  // Gérer les changements dans le champ d'e-mail
  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  // Soumission du formulaire mdp oublié
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);

      // Affichage d'une alerte en cas de succès
      alert(
        'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.'
      );

      // Réinitialisation du champ d'e-mail
      setForgotPasswordEmail('');

      // Redirection
      navigate('/');
    } catch (error) {
      // Affichage d'une alerte en cas d'échec
      alert(
        "Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer."
      );

      // Affichage de l'erreur dans la console
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5 first">
          <div className="card-body p-3 text-center text-white">
            <h2 className="fw-bold text-dark mb-5">Mot de passe oublié?</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              {/* Champ pour saisir l'e-mail */}
              <div className="form-outline text-start mb-4">
                <input
                  type="email"
                  id="email"
                  className="form-control p-2"
                  value={forgotPasswordEmail}
                  onChange={handleForgotPasswordEmailChange}
                  required
                  placeholder="Saisissez votre e-mail"
                  autoComplete="off"
                />
              </div>
              {/* Boutons pour fermer et soumettre le formulaire */}
              <div className="text-end justify-content-between">
                <button
                  type="button"
                  className="btn btn-block btn-secondary me-2"
                >
                  {/* Lien pour fermer la page ou revenir à la page d'accueil */}
                  <Link to="/" className="text-decoration-none text-white">
                    Fermer
                  </Link>
                </button>
                <button type="submit" className="btn but btn-block text-white">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OubliMoPass;
