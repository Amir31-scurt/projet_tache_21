import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from 'react-router-dom';
import Connexion from './Connected/Connexion';
// import Inscription from "./pages/Inscription"
import DashboardApprenant from '../components/DashboardApprenant';
import ChatHome from '../components/chatComponent/ChatHome';
import Programme from '../components/Programme';
import Inscription from '../components/Inscription/Inscription';
import Template from '../layout/template';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css';
import ProgrammeCoach from '../components/programmes/programmes';
import SpecificPro from '../components/programmes/Single_Programmes/specific_program';
import Certificate from '../components/BulletinEtudiant';
import ContentCardLivraison from '../components/ContentCardLivraison';
import AssignationPage from '../components/pageAssignation/AssignationPage';
import '../App.css';
// import Inscription from "./pages/Inscription"
import Table from '../components/super-admin/Table';
import TemplateDemo from '../components/super-admin/Domaine';
import NewCoach from '../components/super-admin/NewCoach';
import StudentTable from '../components/super-admin/StudentTable';
import { EmailContext } from '../contexte/EmailContexte';
import React, { useContext } from 'react';

export default function ProtectedRoutes() {
  // List of admin emails
  const { email } = useContext(EmailContext);
  const adminEmails = ['admin1@gmail.com']; // Admin emails
  const isAdmin = adminEmails.includes(email);

  const adminRoutes = isAdmin
    ? [
        {
          path: '/dashboard/admin',
          element: <Table />,
        },
        {
          path: '/dashboard/table',
          element: <TemplateDemo />,
        },
        {
          path: '/dashboard/coachs',
          element: <NewCoach />,
        },
        {
          path: '/dashboard/etudiants',
          element: <StudentTable />,
        },
      ]
    : [];

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Connexion />,
    },
    {
      path: '/inscription',
      element: <Inscription />,
    },
    {
      path: '/dashboardapprenant/programme',
      element: <Programme />,
    },
    {
      path: '/dashboard',
      element: <Template />,
      children: [
        {
          index: true,
          element: <DashboardApprenant />,
        },
        // Admin routes
        ...adminRoutes,
        // Coach routes
        {
          path: 'programme', // Relative path
          element: <ProgrammeCoach />,
        },
        {
          path: 'chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: 'programme/cours',
          element: <SpecificPro />,
        },
        {
          path: 'certificat',
          element: <Certificate />,
        },
        {
          path: 'livrable',
          element: <ContentCardLivraison />,
        },
        {
          path: 'assignation',
          element: <AssignationPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
