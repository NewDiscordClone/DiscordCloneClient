import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {signoutRedirectCallback} from "./user-service";

const SignOutOidc = () => {
    const navigate = useNavigate();

    useEffect(() => {
        signoutRedirectCallback().then(() => {
                navigate(localStorage.getItem('CallbackRedirect') ?? "/");
            }
        );
    }, [navigate]);

    return <div>Redirecting...</div>;
};

export default SignOutOidc;
