import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {signinRedirectCallback} from "./user-service";

const SingnInOidc= () => {
    const navigate = useNavigate();


    useEffect(() => {
        signinRedirectCallback().then(() => {
                navigate(localStorage.getItem('CallbackRedirect') ?? "/");
            }
        );
    }, [navigate]);

    return <div>Redirecting...</div>;
};

export default SingnInOidc;
