import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import ButtonNoPadding from "components/lib/Button";
import { projectListActions } from "components/ProjectList/project-list.slice";
import { useProjects } from "hooks";
import React from "react";
import { useDispatch } from "react-redux";

const PopOver = () => {
  const dispatch = useDispatch();
  const { data: projects, isLoading } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <ButtonNoPadding
        type="link"
        onClick={() => dispatch(projectListActions.openProjectModel())}
      >
        创建项目
      </ButtonNoPadding>
    </ContentContainer>
  );

  return (
    <Popover placement="bottom" content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;

export default PopOver;
