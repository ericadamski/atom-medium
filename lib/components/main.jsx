"use babel";

import React, { Component } from "react";
import styled from "styled-components";

import User from "./user.jsx";
import Status from "./status.jsx";
import Menu from "./menu.jsx";

const Container = styled.div`
  max-height: 10rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StatusContainer = styled.div``;

const Main = () => (
  <Container>
    <Status />
    <User />
    <Menu />
  </Container>
);

export default Main;
