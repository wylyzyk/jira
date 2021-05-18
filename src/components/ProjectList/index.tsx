import React from "react";
import List from "./List";
import Search from "./Search";
import {
  useDebounce,
  useProjects,
  useUsers,
  useDocumentTitle,
  useProjectModel,
} from "hooks";
import styled from "@emotion/styled";
import { Typography } from "antd";
import { useProjectsSearchParam } from "./util";
import { Row } from "components/style/lib";
import ButtonNoPadding from "components/lib/Button";

/**
 *  基本类型, 组件的状态 可以放在依赖里, 非组件状态对象, 绝不能放在组件依赖里
 * @returns
 */
export const ProjectList = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParam();
  const { isLoading, error, data: list, retry } = useProjects(
    useDebounce(param, 200)
  );
  const { data: users } = useUsers();
  const { open } = useProjectModel();

  return (
    <Container>
      <Row between={true}>
        <h2>项目列表</h2>
        <ButtonNoPadding type="link" onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <Search users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List
        dataSource={list || []}
        users={users || []}
        loading={isLoading}
        refresh={retry}
      />
    </Container>
  );
};

ProjectList.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
`;

export default ProjectList;
