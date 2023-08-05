import { UserManager, UserManagerSettings } from "oidc-client";
import { setAuthHeader } from "./auth-headers";

const userManagerSettings: UserManagerSettings = {
  client_id: 'react-client',
  client_secret: 'react-client-super-secret',
  redirect_uri: 'http://localhost:3000/signin-oidc',
  response_type: 'code',
  scope: 'openid profile roles MessageApi',
  authority: 'https://localhost:7198/',
  post_logout_redirect_uri: 'http://localhost:3000/signout-oidc',
};

const userManager = new UserManager(userManagerSettings);
export async function loadUser() {
  return userManager.getUser().then((user) => {
    const date = Date();
    console.log(date, 'User: ', user);
    const token = user?.access_token;
    setAuthHeader(token);
    return user;
  });
};


export const signinRedirect = () => userManager.signinRedirect();

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

export default userManager;
