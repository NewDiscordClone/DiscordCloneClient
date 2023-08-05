import {ReactNode} from "react";
import SignInOidc from "./auth/SignInOidc";
import SignOutOidc from "./auth/SignOutOidc";
import App from "./components/App";
import AuthApp from "./AuthApp";

type CustomRoute = {
    path: string;
    redirectTo?: string;
    auth?: boolean;
    component?: ReactNode;
}

const customRoutes : CustomRoute[] = [
    {
        path: "/",
        redirectTo: "/auth",
    },
    {
        path: "/signin-oidc",
        component: <SignInOidc/>,
    },
    {
        path: "/signout-oidc",
        component: <SignOutOidc/>,
    },
    {
        path: "/app",
        auth: true,
        component: <App/>,
    },
    {
        path: "/auth",
        component: <AuthApp/>,
    },
    {
        path: "*",
        component: <h1>404 - not found</h1>
    }
];

export default customRoutes;