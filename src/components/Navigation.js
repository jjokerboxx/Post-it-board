import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.ul`
  display: flex;
`;

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">My profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
