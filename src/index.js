import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './cheikh.css';
import { PrimeReactProvider } from 'primereact/api';
import './index.css';
import App from './App';
import './flags.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite-no-reset.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
