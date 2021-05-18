import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import ProjectList from "components/ProjectList";
import { useAuth } from "context/auth-context";
import styled from "@emotion/styled";
import { Row } from "components/style/lib";
import { Button, Dropdown, Menu } from "antd";
import ProjectItem from "components/ProjectItem";
import { resetRouter } from "utils";
import Model from "components/ProjectList/Model";
import ButtonNoPadding from "components/lib/Button";
import PopOver from "components/PopOver";

const Authenticated = () => {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Router>
          <Routes>
            <Route path={"/projects"} element={<ProjectList />}></Route>
            <Route
              path={"/projects/:projectId/*"}
              element={<ProjectItem />}
            ></Route>
            <Navigate to="/projects" />
          </Routes>
        </Router>
      </Main>
      <Model />
    </Container>
  );
};

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type="link" onClick={resetRouter}>
          <h1>Welcome Jira!</h1>
        </ButtonNoPadding>
        <PopOver />
        <h3>用户</h3>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <Button type="link">登出</Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type="link" onClick={logout}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 0 3.2rem;
  text-align: center;
  line-height: 6rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main``;

export default Authenticated;
