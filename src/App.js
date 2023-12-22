import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Template from './layout/template';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/rsuite.min.css';
import Connexion from './pages/Connexion';
import DashboardApprenant from './pages/DashboardApprenant';
import OubliMoPass from './pages/OubliMoPass';
import ChatHome from './components/chatComponent/ChatHome';
// import Programme from './components/Programme';
import ProgrammeCoach from './components/programmes/programmes';
import SpecificPro from './components/programmes/Single_Programmes/specific_program';
import Certificate from './components/BulletinEtudiant';
import AuthContextProvider from './contexte/AuthContext';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Connexion />,
    },
    {
      path: '/modal',
      element: <OubliMoPass />,
    },
    {
      path: '/dashboard',
      element: <Template />,
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
