import { userState } from "atoms";
import { authService, firestoreDB } from "firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Nav = styled.nav`
  margin: 30px;
  display: flex;
  gap: 20px;
  height: 30px;
  align-items: baseline;
  background-color: white;

  a {
    text-decoration: none;
    font-size: 12px;
    color: black;
    /* height: 50px; */

    :first-child {
      font-size: 24px;
      background: linear-gradient(to right top, #ffd359 40%, #44ccff 70%);
      -webkit-background-clip: text;
      color: rgba(0, 0, 0, 0.14);
    }
  }
`;
const Form = styled.form``;
const Input = styled.input`
  padding: 11px 13px;
  background: #f9f9fa;
  color: #f03d4e;
  margin-bottom: 0.9rem;
  border-radius: 4px;
  outline: 0;
  border: 1px solid rgba(245, 245, 245, 0.7);
  font-size: 14px;
`;

const LogOutButton = styled.button`
  position: absolute;
  cursor: pointer;
  right: 20px;
  width: 50px;
  border: none;
  color: white;
  background-color: grey;
  padding: 5px;
  font-size: 10px;
  border-radius: 10px;
  margin: 10px;
  font-family: "SpoqaHanSansNeo";
  transition: all 0.3s ease-out;
  :hover {
    background: #303030;
    color: white;
    animation: 0.2s ease-out forwards;
  }
`;

const ChangeProfileButton = styled.button`
  background-color: rgba(123, 227, 111, 1);
  border-radius: 5px;
  border: none;
  color: white;
  height: 1.8rem;
  font-family: "SpoqaHanSansNeo";
  transition: all 0.3s ease-out;
  :hover {
    background: #303030;
    color: white;
    animation: 0.2s ease-out forwards;
  }
`;

const Navigation = () => {
  const history = useHistory();
  const profileMatch = useRouteMatch("/profile");
  const [formCliked, setFormClicked] = useState(false);
  const [userInfoState, setUserInfoState] = useRecoilState(userState);

  const { register, handleSubmit } = useForm();

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onFormClick = () => {
    setFormClicked((prev) => !prev);
  };

  const changeNickname = async (data, e) => {
    e.preventDefault();
    const userInfo = await doc(firestoreDB, "UserInfo", userInfoState.id);
    //form으로 닉네임 받기
    await updateDoc(userInfo, {
      nickname: data.nickname,
    });
    setUserInfoState({ id: userInfoState.id, nickname: data.nickname });
    setFormClicked(false);
  };

  return (
    <Nav isProfile={profileMatch}>
      <Link to={"/"}>Post It Board</Link>

      <Link
        style={{
          textDecoration: profileMatch ? "underline" : "none",
        }}
        to={"/profile"}
      >
        {userInfoState.nickname}'s profile
      </Link>

      {profileMatch && (
        <ChangeProfileButton onClick={onFormClick}>
          별명 수정하기
        </ChangeProfileButton>
      )}
      {profileMatch && formCliked && (
        <Form onSubmit={handleSubmit(changeNickname)}>
          <Input
            {...register("nickname", {
              required: true,
            })}
            id="change-nickname"
            placeholder="Change Nickname"
          ></Input>
        </Form>
      )}

      <LogOutButton onClick={onLogOutClick}>Log Out</LogOutButton>
    </Nav>
  );
};

export default Navigation;
