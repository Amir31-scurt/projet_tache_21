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
import Programme from "./components/Programme";

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

