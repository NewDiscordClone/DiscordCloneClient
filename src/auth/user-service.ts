import { UserManager, UserManagerSettings } from "oidc-client";
import setAuthHeader from "./setAuthHeader";

const userManagerSettings: UserManagerSettings = {
    client_id: 'react-client',
    client_secret: 'react-client-super-secret',
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile roles MessageApi',
    authority: process.env.REACT_APP_AUTHORITY,
    post_logout_redirect_uri: process.env.REACT_APP_LOGOUT_REDIRECT_URI,
};

const userManager = new UserManager(userManagerSettings);
export default userManager;

export async function loadUser() {
    const user = await userManager.getUser()
    const token = user?.access_token;
    setAuthHeader(token);
    return user;
}

export const signinRedirect = () => userManager.signinRedirect();
export const signinSilent = () => userManager.signinSilent();

export const signinRedirectCallback = () =>
    userManager.signinRedirectCallback();

export const signoutRedirect = (args?: any) => {
    userManager.clearStaleState();
    userManager.removeUser();
    return userManager.signoutRedirect(args);
};

export const signoutRedirectCallback = () => {
    userManager.clearStaleState();
    userManager.removeUser();
    return userManager.signoutRedirectCallback();
};


