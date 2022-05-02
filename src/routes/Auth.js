import React, { useState } from "react";
import { authService } from "firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: white;
  height: 100vh;
`;

const ButtonMenu = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 400px;
  gap: 30px;
`;

const FormDiv = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 414px;
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Input = styled.input`
  max-width: 100%;
  padding: 11px 13px;
  background: #f9f9fa;
  color: #f03d4e;
  margin-bottom: 0.9rem;
  border-radius: 4px;
  outline: 0;
  border: 1px solid rgba(245, 245, 245, 0.7);
  font-size: 14px;
  transition: all 0.3s ease-out;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.1);
  :focus,
  :hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15), 0 1px 5px rgba(0, 0, 0, 0.1);
  }
`;
const SubmitButton = styled.button`
  max-width: 100%;
  padding: 11px 13px;
  color: rgb(253, 249, 243);
  font-weight: 600;
  text-transform: uppercase;
  background: #f03d4e;
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  :hover {
    background: rgb(200, 50, 70);
    animation: 0.2s ease-out forwards;
  }
`;

const GoogleButton = styled.button`
  max-width: 100%;
  padding: 11px 13px;
  color: rgb(253, 249, 243);
  font-weight: 600;
  text-transform: uppercase;
  background: grey;
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  :hover {
    background: #3d3b3b;
    animation: 0.2s ease-out forwards;
  }
`;

const AlterButton = styled.button`
  max-width: 100%;
  padding: 11px 13px;
  color: black;
  font-weight: 600;
  text-transform: uppercase;
  background: #e8dfdf;
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  :hover {
    background: #303030;
    color: white;
    animation: 0.2s ease-out forwards;
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 38px;
  margin-top: 30px;
  margin-bottom: 20px;
`;

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
    <Wrapper>
      <Title>사용자 인증</Title>
      <FormDiv>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
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
          ></Input>
          <Input
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
          ></Input>
          <SubmitButton type="submit">
            {newAccount ? "가입하기" : "로그인"}
          </SubmitButton>
        </Form>
        <ButtonMenu>
          <div>
            <GoogleButton onClick={onGoogleClick}>
              Goolge 로그인 하기
            </GoogleButton>
            {/* <button>Github으로 로그인 하기</button> */}
          </div>
          <div>
            <AlterButton onClick={toggleAccount}>
              {newAccount ? "이미 계정이 있어요" : "새롭게 계정을 생성해야해요"}
            </AlterButton>
          </div>
        </ButtonMenu>

        {error}
      </FormDiv>
    </Wrapper>
  );
}
export default Auth;
