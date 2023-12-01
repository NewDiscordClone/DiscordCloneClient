import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {signoutRedirectCallback} from "./user-service";
import LoadingPage from "../components/App/LoadingPage";

const SignOutOidc = () => {
    const navigate = useNavigate();

    useEffect(() => {
        signoutRedirectCallback().then(() => {
                navigate(localStorage.getItem('CallbackRedirect') ?? "/");
            }
        );
    }, [navigate]);

    return <LoadingPage/>;
};

export default SignOutOidc;
