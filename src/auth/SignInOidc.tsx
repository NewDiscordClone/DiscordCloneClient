import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signinRedirectCallback } from "./user-service";

const SingnInOidc: FC<{}> = () => {
  const navigate = useNavigate();


  useEffect(() => {
    async function signInAsync() {
      await signinRedirectCallback();
      navigate('/');
    }

    signInAsync();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default SingnInOidc;
