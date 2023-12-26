import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { RiLockPasswordFill } from 'react-icons/ri';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { auth } from '../config/firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function FormConnect() {
  // Les states pour la connexion / login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // UseNavigate pour les redirections
  const navigate = useNavigate();

  // les changements dans les champs
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Fonction pour la connexion / login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (error) {
      // alert('Échec de la connexion. Veuillez vérifier vos informations.');
      toast.error(
        'Échec de la connexion. Veuillez vérifier vos informations.',
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        }
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className=" tire mb-4">
        <div className="input-group  flex-nowrap">
          <span class="input-group-text" id="addon-wrapping">
            <CiMail />
          </span>
          <input
            type="email"
            class="form-control "
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
      </div>

      <div className=" tire ">
        <div className="input-group mb-3  flex-nowrap">
          <span class="input-group-text" id="addon-wrapping">
            <RiLockPasswordFill />
          </span>
          <input
            type="password"
            class="form-control "
            placeholder="Mot de passe"
            value={password}
            onChange={handlePasswordChange}
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
        <p
          className="m-0 p-0 text-end oubli"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Mot de passe oublié?
        </p>
        {/* <!-- Modal --> */}
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Mot de pass oublié{' '}
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-outline text-start mb-4">
                  <input
                    type="email"
                    id="email"
                    class="form-control p-2"
                    required
                    placeholder="Saisissez votre mail"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
          <Link to="/Modal" className="text-decoration-none">
            <p className="m-0 p-0 text-end oubli">Mot de passe oublié?</p>
          </Link>
        </div>

        <div className="pt-1 mt-4 text-end">
          <center>
            <button
              type="submit"
              className="btn d-flex justify-content-center align-items-center fs-6 btn-lg btn-block text-white log"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
          </center>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}
