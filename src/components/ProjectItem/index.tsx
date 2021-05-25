import { Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, useLocation } from "react-router";
import KanBan from "./kanban";
import Epic from "./epic";
import styled from "@emotion/styled";

const useRouteType = () => {
  const unit = useLocation().pathname.split("/");
  return unit[unit.length - 1];
};

const ProjectItem = () => {
  const routeType = useRouteType();

  return (
    <Container>
      {/* /kanban hui跳转根路由, 要在原有路径后面添加, 要去掉 / */}
      <Aside>
        <Menu mode="inline" selectedKeys={[routeType]}>
          <Menu.Item key="kanban">
            <Link to="kanban">看板</Link>
          </Menu.Item>
          <Menu.Item key="epic">
            <Link to="epic">任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path="/kanban" element={<KanBan />} />
          <Route path="/epic" element={<Epic />} />
          {/* replace ={true} 如果路由当前路由不匹配, 会将重定向的路由替换当前路由, 而不是简单的push */}
          <Navigate to={window.location.pathname + "/kanban"} replace={true} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244 245, 247);
  display: flex;
`;

const Main = styled.div`
  display: flex;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 16rem 1fr;
  overflow: hidden;
`;

export default ProjectItem;
