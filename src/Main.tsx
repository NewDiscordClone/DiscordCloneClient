import React from 'react';
import Chat from "./components/Chat";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import App from "./components/App";
import SingnInOidc from './auth/SignInOidc';
import SignOutOidc from './auth/SignOutOidc';
import { loadUser } from './auth/user-service';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/signin-oidc"} />,
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/signin-oidc",
    element: <SingnInOidc />
  },
  {
    path: "/signout-oidc",
    element: <SignOutOidc />
  },
  {
    path: "/app",
    element: <App />
  }
]);

function Main() {
  loadUser();
  return <RouterProvider router={router} />
}

export default Main;
