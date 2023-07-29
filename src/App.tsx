import React from 'react';
import Chat from "./components/Chat";
import Register from "./components/Entrance/Register";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Login from "./components/Entrance/Login";

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
    path: "/Register",
    element: <Register/>
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
