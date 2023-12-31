import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from 'react-router-dom';

import Connexion from './pages/Connected/Connexion';
// import Inscription from "./pages/Inscription"
import DashboardApprenant from './pages/DashboardApprenant';
import ChatHome from './components/chatComponent/ChatHome';
import Programme from './components/Programme';
import Inscription from './pages/Inscription';
import Template from './layout/template';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css';
import ProgrammeCoach from './components/programmes/programmes';
import SpecificPro from './components/programmes/Single_Programmes/specific_program';
import Certificate from './components/BulletinEtudiant';
import {AuthContextProvider} from './contexte/AuthContext';
import CardLivraison from './components/CompoDashCoach/CardLivraison';
import ContentCardLivraison from './components/ContentCardLivraison';
import AssignationPage from './pages/pageAssignation/AssignationPage';
import './App.css';
// import Inscription from "./pages/Inscription"
import CoursHtmlCss from './components/ProEtudiant/Cours';

export default function App() {
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
      element: <ChatHome />,
      // =======
      //       path: "/Cours/HtmlCss",
      //       element: <CoursHtmlCss />,
      //     },
      //     {
      //       path: "/dashboardapprenant",
      //       element: <DashboardApprenant />,
      // >>>>>>> 19-12-2023-Connexion
      children: [
        {
          index: true, // Index route for /timeline
          element: <DashboardApprenant />,
        },
        {
          path: '/dashboard/programme', // Relative path
          element: <ProgrammeCoach />,
        },
        {
          index: true,
          path: '/dashboard/chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: '/dashboard/programme/cours',
          element: <SpecificPro />,
        },
        {
          path: '/dashboard/certificat',
          element: <Certificate />,
        },
        {
          path: '/dashboard/livrable',
          element: <ContentCardLivraison />,
        },
        {
          path: '/dashboard/assignation',
          element: <AssignationPage />,
        },
      ],
    },
  ]);

  return (
    <AuthContextProvider>
      <div className="">
        <RouterProvider router={router} />
      </div>
    </AuthContextProvider>
  );
}
