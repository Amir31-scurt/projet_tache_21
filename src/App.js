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
<<<<<<< HEAD
import ChatHome from "./components/chatComponent/ChatHome";
=======
import Programme from "./components/Programme";
>>>>>>> 2fa79db052fa1c7a96b731863895a0110bbf4a32

export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Connexion />,
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

