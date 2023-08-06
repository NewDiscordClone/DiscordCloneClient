import { ReactElement } from 'react';
import {
  signinRedirect,
  signoutRedirect
} from './auth/user-service';
import TestAuth from './auth/test-auth/TestAuth';

const AuthApp = (): ReactElement => {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => signinRedirect()}>Login</button>
        <button onClick={() => signoutRedirect()}>Logut</button>
      </header>
      <TestAuth />
    </div >
  );
}

export default AuthApp;
