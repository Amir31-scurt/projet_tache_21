import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from "react-router-dom";

import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription"
import DashboardApprenant from "./pages/DashboardApprenant";
import OubliMoPass from './pages/OubliMoPass';

export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Connexion/>,
    },
    // {
    //   path: "/Inscription",
    //   element: <Inscription />,
    // },
    {
      path: "/modal",
      element: <OubliMoPass/>
    },
    {
      path: "/dashboardapprenant",
      element: <DashboardApprenant />,
      children: [
        // {
        // path: "/dashboardapprenant/",
        // element: <nomComposantHome/>,
        // },
      ],
    },
  ]);
  return (
    <RouterProvider router={rooter} />
  );
}

