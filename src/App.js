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
      path: '/timeline',
      element: <Template />,
      children: [
        {
          index: true, // Index route for /timeline
          element: <DashboardApprenant />,
        },
        {
          path: '/timeline/programme', // Relative path
          element: <ProgrammeCoach />,
        },
        {
          index: true,
          path: '/timeline/chatHome', // Relative path
          element: <ChatHome />,
        },
        {
          path: '/timeline/programme/cours',
          element: <SpecificPro />,
        },
        {
          path: '/timeline/certificat',
          element: <Certificate />,
        },
      ],
    },
  ]);

  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
  );
}
