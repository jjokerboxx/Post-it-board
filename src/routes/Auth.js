import React, { useState } from "react";
import { authService } from "fbase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccout] = useState(true);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let authData;
            if(newAccount){
                //auth.createUserWithEmailAndPassword 
                authData = await createUserWithEmailAndPassword(authService, email, password);
            } else {
                authData = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(authData);
        } catch (error) {
            console.log(error)
        }
        
    }

    const onChange = (e) => {
        //destructring event
        const {target : {name, value},} = e;
        if (name === "email"){
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    }

    return (<div>
    <span>Auth</span>
    <div>
        <form onSubmit={onSubmit}>
            <input type="email" id="id" name="email" placeholder="Email" required value={email} onChange={onChange}></input>
            <input type="text" id="pw" name="password" placeholder="Password" required value={password} onChange={onChange}></input>
            <input type="submit" value={newAccount ? "Create Account" : "Login"}></input>
        </form>
        <div>
            <button>Continue with Goolge</button>
            <button>Continue with Github</button>
        </div>
    </div>

</div>)};
export default Auth;