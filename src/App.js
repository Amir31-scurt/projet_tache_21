import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from "react-router-dom";

import Connexion from "./pages/Connected/Connexion";
// import Inscription from "./pages/Inscription"
import DashboardApprenant from "./pages/DashboardApprenant";
import OubliMoPass from './pages/Connected/OubliMoPass';
import Programme from "./components/ProEtudiant/Programme";
import CoursHtmlCss from "./components/ProEtudiant/Cours";

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
      path: "/Cours/HtmlCss",
      element: <CoursHtmlCss />,
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

