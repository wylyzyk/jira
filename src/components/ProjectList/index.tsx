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
import { useProjectsSearchParam } from "./util";
import { Row } from "components/style/lib";
import ButtonNoPadding from "components/lib/Button";
import { ErrorBox } from "components/lib/FullPageLoading";
import { Profiler } from "components/Profiler";

/**
 *  基本类型, 组件的状态 可以放在依赖里, 非组件状态对象, 绝不能放在组件依赖里
 * @returns
 */
export const ProjectList = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParam();
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  const { open } = useProjectModel();

  return (
    // Profiler 用来追踪性能
    <Profiler id="项目列表">
      <Container>
        <Row between={true} marginBottom={2}>
          <h2>项目列表</h2>
          <ButtonNoPadding type="link" onClick={open}>
            创建项目
          </ButtonNoPadding>
        </Row>
        <Search users={users || []} param={param} setParam={setParam} />
        <ErrorBox error={error} />
        <List dataSource={list || []} users={users || []} loading={isLoading} />
      </Container>
    </Profiler>
  );
};

ProjectList.whyDidYouRender = false;

const Container = styled.div`
  padding: 3.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default ProjectList;
