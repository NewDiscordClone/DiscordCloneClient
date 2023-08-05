import { FC, ReactElement } from 'react';
import {
  signinRedirect,
  signoutRedirect
} from './auth/user-service';

const AuthApp: FC<{}> = (): ReactElement => {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => signinRedirect()}>Login</button>
        <button onClick={() => signoutRedirect()}>Logut</button>
      </header>
    </div >
  );
}

export default AuthApp;
