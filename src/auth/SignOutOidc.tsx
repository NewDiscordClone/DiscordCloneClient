import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signoutRedirectCallback } from "./user-service";

const SignOutOidc: FC<{}> = () => {
  const navigate = useNavigate();


  useEffect(() => {
    async function signOutAsync() {
      await signoutRedirectCallback();
      navigate('/')
    }

    signOutAsync();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default SignOutOidc;
