import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/lib/lib";
import { useDocumentTitle } from "hooks";
import { useKanbans } from "hooks/kanban";
import { useTasks } from "hooks/task";
import React from "react";
import { CreateKanban } from "./CreateKanban";
import KanbanColumn from "./KanbanColumn";
import SearchPanel from "./search-panel";
import { TaskModal } from "./TaskModal";
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTaskSearchParams,
} from "./until";

const KanBan = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans = [], isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTaskSearchParams());
  const isLoading = kanbanIsLoading || taskIsLoading;

  return (
    <ScreenContainer>
      <h1>{currentProject?.name} 看板</h1>
      <SearchPanel />
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <ColumnsContainer>
          {kanbans.map((kanban) => (
            <KanbanColumn kanban={kanban} key={kanban.id} />
          ))}
          <CreateKanban />
        </ColumnsContainer>
      )}
      <TaskModal />
    </ScreenContainer>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;

export default KanBan;
