import React, { useState } from "react";
import List from "./List";
import Search from "./Search";
import { useDebounce, useProjects, useUsers, useDocumentTitle } from "hooks";
import styled from "@emotion/styled";
import { Typography } from "antd";
// import { Helmet } from "react-helmet";

export const ProjectList = () => {
  const [param, setParam] = useState({ name: "", personId: "" });
  const debouncedParam = useDebounce(param, 200);
  const { isLoading, error, data: list } = useProjects(debouncedParam);
  const { data: users } = useUsers();

  useDocumentTitle("项目列表", false);

  return (
    <Container>
      <h2>项目列表</h2>
      <Search users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List dataSource={list || []} users={users || []} loading={isLoading} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`;

export default ProjectList;
