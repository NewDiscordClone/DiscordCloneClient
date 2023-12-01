import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {signinRedirectCallback} from "./user-service";
import LoadingPage from "../components/App/LoadingPage";

const SingnInOidc= () => {
    const navigate = useNavigate();


    useEffect(() => {
        signinRedirectCallback().then(() => {
                navigate(localStorage.getItem('CallbackRedirect') ?? "/");
            }
        );
    }, [navigate]);

    return <LoadingPage/>;
};

export default SingnInOidc;
