import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {User, UserManager} from 'oidc-client';
import setAuthHeader from './setAuthHeader';
import {loadUser, signinRedirect} from './user-service';
import {useLocation} from "react-router-dom";
import userManager from "./user-service";

const AuthProvider = ({
                          children
                      }: { children: ReactNode }): any => {
    const location = useLocation();
    const [isLoaded, setLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    let userManagerRef = useRef<UserManager>();
    useEffect(() => {
        loadUser().then(user => {
            setUser(user);
            setLoaded(true);
        });
        userManagerRef.current = userManager;
        const onUserLoaded = (user: User) => {
            console.log('User loaded ', user);
            setAuthHeader(user.access_token);
            setLoaded(true);
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

        userManagerRef.current.events.addUserLoaded(onUserLoaded);
        userManagerRef.current.events.addUserUnloaded(onUserUnloaded);
        userManagerRef.current.events.addAccessTokenExpired(onAccessTokenExpired);
        userManagerRef.current.events.addAccessTokenExpiring(onAccessTokenExpiring);
        userManagerRef.current.events.addUserSignedOut(onUserSignedOut);

        return () => {
            if (userManagerRef && userManagerRef.current) {
                userManagerRef.current.events.removeUserLoaded(onUserLoaded);
                userManagerRef.current.events.removeUserUnloaded(onUserUnloaded);
                userManagerRef.current.events.removeAccessTokenExpired(onAccessTokenExpired);
                userManagerRef.current.events.removeAccessTokenExpiring(onAccessTokenExpiring);
                userManagerRef.current.events.removeUserSignedOut(onUserSignedOut);
            }
        }
    }, [userManager]);

    if (!isLoaded)
        return <></>
    else if (user === null) {
        console.log("SignInRedirect");
        localStorage.setItem('CallbackRedirect', location.pathname);
        signinRedirect();
        return <></>
    } else {
        //console.log(user);
        return React.Children.only(children);
    }
}

export default AuthProvider;
