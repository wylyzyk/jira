import React from "react";
import ProjectList from "components/ProjectList";
import { useAuth } from "context/auth-context";
import styled from "@emotion/styled";
import { Row } from "components/style/lib";
import { Button, Dropdown, Menu } from "antd";

const Authenticated = () => {
  const { logout, user } = useAuth();
  return (
    <Container>
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
      <ProjectList />
    </Container>
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
