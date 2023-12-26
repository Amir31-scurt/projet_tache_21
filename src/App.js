import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from "react-router-dom";

import Connexion from "./pages/Connexion";
// import Inscription from "./pages/Inscription"
import DashboardApprenant from "./pages/DashboardApprenant";
import OubliMoPass from './pages/OubliMoPass';
import ChatHome from "./components/chatComponent/ChatHome";
import Programme from "./components/Programme";
import Inscription from "./pages/Inscription";

export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Connexion />,
    },
    {
      path: "/inscription",
      element: <Inscription />,
    },
    {
      path: "/dashboardapprenant/programme",
      element: <Programme />,
    },
    {
      path: "/modal",
      element: <OubliMoPass />,
    },
    {
      path: "/chatHome",
      element: <ChatHome/>
    },
    {
      path: "/dashboardapprenant",
      element: <DashboardApprenant />,
      children: [
        // {
        // path: "/dashboardapprenant/programme",
        // element: <Programme/>,
        // },
      ],
    },
  ]);
  return (
    <RouterProvider router={rooter} />
  );
}

