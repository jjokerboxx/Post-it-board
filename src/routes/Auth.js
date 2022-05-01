import React, { useState } from "react";
import { authService } from "firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm } from "react-hook-form";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccout] = useState(true);
  const [error, setError] = useState("");

  const toggleAccount = () => setNewAccout((prev) => !prev);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, e) => {
    console.log(data);
    e.preventDefault();
    try {
      let authData;
      if (newAccount) {
        authData = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        authData = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  const onGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(authService, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  const onChange = (e) => {
    //destructring event
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <div>
      <span>사용자 인증</span>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("email", {
              required: true,
              onChange: onChange,
              value: email,
            })}
            type="email"
            id="id"
            placeholder="Email"
            // value={email}
            // onChange={onChange}
          ></input>
          <input
            {...register("password", {
              required: true,
              onChange: onChange,
              value: password,
            })}
            type="text"
            id="pw"
            placeholder="Password"
            // required
            // value={password}
            // onChange={onChange}
          ></input>
          <input
            type="submit"
            value={newAccount ? "가입하기" : "로그인"}
          ></input>
        </form>
        <div>
          <button onClick={onGoogleClick}>Goolge로 로그인 하기</button>
          {/* <button>Github으로 로그인 하기</button> */}
        </div>
        <div>
          <button onClick={toggleAccount}>
            {newAccount ? "이미 계정이 있어요." : "새롭게 계정을 생성해야해요."}
          </button>
        </div>
        {error}
      </div>
    </div>
  );
}
export default Auth;
