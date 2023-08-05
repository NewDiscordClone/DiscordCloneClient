import React, {useState} from 'react';

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onLoginButton = () => {
        console.log("login");
    }

    return (
        <form>
            <label>Email address</label>
            <br/>
            <input type={"text"} inputMode={"email"} value={email} onChange={({target: {value}}) => setEmail(value)}/>
            <br/>
            <label>Password</label>
            <br/>
            <input type={"password"} value={password} onChange={({target: {value}}) => setPassword(value)}/>
            <br/>
            <button type={"button"} onClick={onLoginButton}>Login</button>
        </form>
    );
};

export default Login;