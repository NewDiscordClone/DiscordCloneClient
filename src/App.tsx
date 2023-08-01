import React, { FC, ReactElement } from 'react';
import logo from './logo.svg';
import './App.css';
import userManager, {
  loadUser,
  signinRedirect,
  signoutRedirect
} from './auth/user-service';
import AuthProvider from './auth/auth-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignOutOidc from './auth/SignOutOidc';
import SignInOidc from './auth/SignInOidc';
import TestAuth from './auth/test-auth/TestAuth';

const App: FC<{}> = (): ReactElement => {
  loadUser();
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => signinRedirect()}>Login</button>
        <button onClick={() => signoutRedirect()}>Logut</button>
        <AuthProvider userManager={userManager}>
          <BrowserRouter >
            <Routes>
              <Route path="/" Component={TestAuth} />
              <Route path="/signout-oidc" Component={SignOutOidc} />
              <Route path="/signin-oidc" Component={SignInOidc} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </header>
    </div>
  );
}

export default App;
