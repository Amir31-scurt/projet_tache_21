import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from "react-router-dom";

import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription"
import DashboardApprenant from "./pages/DashboardApprenant";

export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Connexion/>,
    },
    {
      path: "/Inscription",
      element: <Inscription />,
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

