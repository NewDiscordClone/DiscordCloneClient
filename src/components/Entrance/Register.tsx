import React, {useState} from 'react';

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onRegisterButton = () => {
        console.log("register");
    }

    return (
        <form>
            <label>Email address</label>
            <br/>
            <input type={"text"} inputMode={"email"} value={email} onChange={({target: {value}}) => setEmail(value)}/>
            <br/>
            <label>Username</label>
            <br/>
            <input type={"text"} value={username} onChange={({target: {value}}) => setUsername(value)}/>
            <br/>
            <label>Password</label>
            <br/>
            <input type={"password"} value={password} onChange={({target: {value}}) => setPassword(value)}/>
            <br/>
            <button type={"button"} onClick={onRegisterButton}>Register</button>
        </form>
    );
};

export default Register;