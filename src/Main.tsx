import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import customRoutes from "./CustomRoutes";
import "./Main.scss"

const router = createBrowserRouter(customRoutes.map(route => {
    if (route.redirectTo) {
        return {
            path: route.path,
            element: <Navigate to={route.redirectTo}/>,
        };
    } else {
        return {
            path: route.path,
            element: route.auth ?
                <AuthProvider>
                    {route.component}
                </AuthProvider>
                :
                route.component,
        };
    }
}));

function Main() {
    return <RouterProvider router={router}/>;
}

export default Main;
