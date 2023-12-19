import { useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";


export default function App() {

  const rooter = createBrowserRouter([
    {
      path: "/",
      element: <Inscription />,
    },
    {
      path: "/connection",
      element: <Connection />,
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