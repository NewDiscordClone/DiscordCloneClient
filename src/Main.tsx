import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import App from "./components/App";
import SingnInOidc from './auth/SignInOidc';
import SignOutOidc from './auth/SignOutOidc';
import AuthApp from "./AuthApp";
import userManager, { loadUser, signinRedirect } from "./auth/user-service";
import AuthProvider from "./auth/auth-provider";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/auth"} />,
  },
  // {
  //   //  path: "/chat",
  //   // element: <Chat />
  // },
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
  },
  {
    path: "/auth",
    element: <AuthApp />
  }
]);



function Main() {
  const [isLoaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const onUserLoaded = (user: any) => {
    if (!user) {
      signinRedirect();
    } else {
      setLoaded(true)
    }
  }

  if (!isLoaded)
    return <></>
  else
    return <AuthProvider onUserLoadedCallback={onUserLoaded} userManager={userManager}><RouterProvider router={router} /></AuthProvider >
}

export default Main;
