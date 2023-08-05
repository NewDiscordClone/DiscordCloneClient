import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { User, UserManager } from 'oidc-client';
import { setAuthHeader } from './auth-headers';
import { signinRedirect } from './user-service';

type AuthProviderProps = {
  userManager: UserManager;
  onUserLoadedCallback: (user: any) => void,
  children: ReactNode
};

const AuthProvider: FC<AuthProviderProps> = ({
  userManager: manager,
  onUserLoadedCallback,
  children
}): any => {
  let userManager = useRef<UserManager>();
  useEffect(() => {
    userManager.current = manager;
    const onUserLoaded = (user: User) => {
      console.log('User loaded ', user);
      setAuthHeader(user.access_token);
      onUserLoadedCallback(user);
    };
    const onUserUnloaded = () => {
      setAuthHeader(null);
      console.log('User unloaded');
    };
    const onAccessTokenExpiring = () => {
      console.log('User access token expiring');
    };
    const onAccessTokenExpired = () => {
      console.log('User access token expired');
    };
    const onUserSignedOut = () => {
      console.log('User signed out');
    };

    userManager.current.events.addUserLoaded(onUserLoaded);
    userManager.current.events.addUserUnloaded(onUserUnloaded);
    userManager.current.events.addAccessTokenExpired(onAccessTokenExpired);
    userManager.current.events.addAccessTokenExpiring(onAccessTokenExpiring);
    userManager.current.events.addUserSignedOut(onUserSignedOut);

    return function cleanup() {
      if (userManager && userManager.current) {
        userManager.current.events.removeUserLoaded(onUserLoaded);
        userManager.current.events.removeUserUnloaded(onUserUnloaded);
        userManager.current.events.removeAccessTokenExpired(onAccessTokenExpired);
        userManager.current.events.removeAccessTokenExpiring(onAccessTokenExpiring);
        userManager.current.events.removeUserSignedOut(onUserSignedOut);
      }
    }
  }, [manager]);

  return React.Children.only(children);
}

export default AuthProvider;
