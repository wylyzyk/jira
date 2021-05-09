import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navigate, Route, Routes } from "react-router";
import ProjectList from "components/ProjectList";
import { useAuth } from "context/auth-context";
import styled from "@emotion/styled";
import { Row } from "components/style/lib";
import { Button, Dropdown, Menu } from "antd";
import ProjectItem from "components/ProjectItem";

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
          </Routes>
        </Router>
      </Main>
    </Container>
  );
};

const PageHeader = () => {
  const { logout, user } = useAuth();
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <h1>Welcome Jira!</h1>
        <h2>项目</h2>
        <h2>用户</h2>
      </HeaderLeft>
      <HeaderRight>
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
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main``;

export default Authenticated;
