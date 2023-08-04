import React from 'react';
import Chat from "./components/Chat";
import Register from "./components/Entrance/Register";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Login from "./components/Entrance/Login";
import App from "./components/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"}/>,
  },
  {
    path: "/chat",
    element: <Chat/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/app",
    element: <App/>
  }
]);

function Main() {
  return <RouterProvider router={router} />
}

export default Main;
