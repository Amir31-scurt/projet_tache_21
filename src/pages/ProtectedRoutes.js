import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from 'react-router-dom';
import Connexion from './Connected/Connexion';
import DashboardApprenant from '../components/DashboardApprenant';
import ChatHome from '../components/chatComponent/ChatHome';
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
import CreateDomaine from '../components/super-admin/CreateDomaine';
import NewCoach from '../components/super-admin/NewCoach';
import StudentTable from '../components/super-admin/StudentTable';
import { EmailContext } from '../contexte/EmailContexte';
import React, { useContext, useState, useEffect } from 'react';
import { fetchAdminEmails } from '../utils/fetchAdminEmails';
import { fetchCoachEmails } from '../utils/fetchCoachEmails';
import { fetchStudentEmails } from '../utils/fetchStudentEmails';
import StudentProgram from '../components/ProEtudiant/Programme';
import Cours from '../components/ProEtudiant/Cours';
import UserTable from '../components/super-admin/TableauUtilisateurs';
import logo from '../assets/images/logo.png';
import Quizz from '../components/quizzs/quizzs';
import RenduBulletinEtudiant from '../components/RenduBulletinEtudiant';
import BulletinEtudiant from '../components/BulletinEtudiant';
import NotFound from './NotFound';

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

  if (!isReady) {
    return (
      <div className="loadingPageLogo">
        <img src={logo} alt="logo" />
      </div>
    ); // or any other loading indicator
  }

  const isAdmin = adminEmails.includes(email);
  const isCoach = coachEmails.includes(email);
  const isStudent = studentEmails.includes(email);

  const adminRoutes = isAdmin
    ? [
        {
          path: '/admin/dashboard',
          element: <ChatHome />,
        },
        {
          path: '/admin/assignation',
          element: <TemplateDemo />,
        },
        {
          path: '/admin/createDomaine',
          element: <CreateDomaine />,
        },
        {
          path: '/admin/certificats',
          element: <BulletinEtudiant />,
        },
        {
          path: "*",
          element: <NotFound redirect="/admin/dashboard"/>
        }
      ]
    : [];
  const coachRoutes = isCoach
    ? [
        {
          path: '/coach/dashboard',
          element: <DashboardApprenant />,
        },
        {
          path: '/coach/programme', // Relative path
          element: <ProgrammeCoach />,
        },
        {
          path: '/coach/chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: '/coach/programme/cours/:courseId',
          element: <SpecificPro />,
        },
        {
          path: '/coach/certificat',
          element: <Certificate />,
        },
        {
          path: '/coach/livrable',
          element: <ContentCardLivraison />,
        },
        {
          path: '/coach/assignation',
          element: <AssignationPage />,
        },
        {
          path: "*",
          element: <NotFound redirect="/coach/dashboard" />
        }
      ]
    : [];
  const studentRoutes = isStudent
    ? [
        {
          path: 'etudiant/dashboard',
          element: <DashboardApprenant />,
        },
        {
          path: 'etudiant/programme-apprenant', // Relative path
          element: <StudentProgram />,
        },
        {
          path: 'etudiant/chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: 'etudiant/certificat',
          element: <RenduBulletinEtudiant />,
        },
        {
          path: 'etudiant/livrable',
          element: <ContentCardLivraison />,
        },
        {
          path: 'etudiant/cours/:domaineId/:sousDomaineName',
          element: <Cours />,
        },
        {
          path: 'etudiant/quizz',
          element: <Quizz />,
        },
        {
          path: "*",
          element: <NotFound redirect="etudiant/dashboard" />
        }
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
      path: '/',
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
