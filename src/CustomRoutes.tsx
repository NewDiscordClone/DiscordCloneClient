import { ReactNode } from "react";
import SignInOidc from "./auth/SignInOidc";
import SignOutOidc from "./auth/SignOutOidc";
import App from "./components/App/App";
import AuthApp from "./AuthApp";
import Invitation from "./components/Invitation/Invitation";
import Landing from "./components/Landing/Landing";
import UserInfoTest from "./components/App/UserInfo/UserInfoTest";

type CustomRoute = {
    path: string;
    redirectTo?: string;
    auth?: boolean;
    component?: ReactNode;
}

const customRoutes: CustomRoute[] = [
    // {
    //     path: "/",
    //     redirectTo: "/app",
    // },
    {
        path: "/",
        component: <Landing/>
    },
    {
        path: "/signin-oidc",
        component: <SignInOidc />,
    },
    {
        path: "/signout-oidc",
        component: <SignOutOidc />,
    },
    {
        path: "/app",
        auth: true,
        component: <App />,
    },
    {
        path: "/invitation/:id",
        auth: true,
        component: <Invitation/>
    },
    {
        path: "/auth",
        component: <AuthApp />,
    },
    {
        path: "/user",
        component: <UserInfoTest />,
    },
    {
        path: "*",
        component: <h1>404 - not found</h1>
    }
];

export default customRoutes;