import { useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Connexion from "./pages/Connexion";

export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Inscription />,
    },
    {
      path: "/connecxion",
      element: <Connexion/>
    },
    {
      path: "/dashboardapprenant",
      element: <DashboardApprenant />,
      children: [
        {
          path: "/dashboardapprenant/home",
          element: <nomComposantHome/>,
        },
      ],
    },
  ]);
  return (
    <RouterProvider router={rooter} />
  );
}