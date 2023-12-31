import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from 'react-router-dom';
import Connexion from './Connected/Connexion';
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
import Table from '../components/super-admin/Table';
import TemplateDemo from '../components/super-admin/AssignationDomaines';
import NewCoach from '../components/super-admin/NewCoach';
import StudentTable from '../components/super-admin/StudentTable';
import { EmailContext } from '../contexte/EmailContexte';
import React, { useContext, useState, useEffect } from 'react';
import { fetchAdminEmails } from '../utils/fetchAdminEmails';
import { fetchCoachEmails } from '../utils/fetchCoachEmails';
import { fetchStudentEmails } from '../utils/fetchStudentEmails';
import StudentProgram from '../components/ProEtudiant/Programme';

export default function ProtectedRoutes() {
  const { email } = useContext(EmailContext);
  const [adminEmails, setAdminEmails] = useState([]);
  const [coachEmails, setCoachEmails] = useState([]);
  const [studentEmails, setStudentEmails] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchAdminEmails().then((emails) => {
      setAdminEmails(emails);
      setIsReady(true); // Set this to true after the fetch is complete
    });
    fetchCoachEmails().then((emails) => {
      setCoachEmails(emails);
      setIsReady(true); // Set this to true after the fetch is complete
    });
    fetchStudentEmails().then((emails) => {
      setStudentEmails(emails);
      setIsReady(true); // Set this to true after the fetch is complete
    });
  }, []);

  const isAdmin = adminEmails.includes(email);
  const isCoach = coachEmails.includes(email);
  const isStudent = studentEmails.includes(email);

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
        {
          path: '/dashboard/inscription',
          element: <Inscription />,
        },
      ]
    : [];
  const coachRoutes = isCoach
    ? [
        {
          index: true,
          element: <DashboardApprenant />,
        },
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
      ]
    : [];
  const studentRoutes = isStudent
    ? [
        {
          index: true,
          element: <DashboardApprenant />,
        },
        {
          path: 'programme-apprenant', // Relative path
          element: <StudentProgram />,
        },
        {
          path: 'chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: 'certificat',
          element: <Certificate />,
        },
        {
          path: 'livrable',
          element: <ContentCardLivraison />,
        },
      ]
    : [];

  // Add more conditional routes as necessary

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Connexion />,
    },
    {
      path: '/dashboardapprenant/programme',
      element: <StudentProgram />,
    },
    {
      path: '/dashboard',
      element: <Template />,
      children: [
        // Admin routes
        ...adminRoutes,
        // Coach routes
        ...coachRoutes,
        // Students routes
        ...studentRoutes,
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
