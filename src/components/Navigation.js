import { authService } from "firebase";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
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
    height: 1rem;

    :first-child {
      color: "1B1A17";
      font-size: 24px;
    }
  }
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

const Navigation = () => {
  const history = useHistory();

  const profileMatch = useRouteMatch("/profile");
  console.log(profileMatch);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
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
        My profile
      </Link>
      <LogOutButton onClick={onLogOutClick}>Log Out</LogOutButton>
    </Nav>
  );
};

export default Navigation;
