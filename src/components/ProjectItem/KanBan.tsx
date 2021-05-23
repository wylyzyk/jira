import styled from "@emotion/styled";
import { useDocumentTitle } from "hooks";
import { useKanbans } from "hooks/kanban";
import React from "react";
import KanbanColumn from "./KanbanColumn";
import SearchPanel from "./search-panel";
import { useKanbanSearchParams, useProjectInUrl } from "./until";

const KanBan = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans = [] } = useKanbans(useKanbanSearchParams());

  return (
    <div>
      <h1>{currentProject?.name} 看板</h1>
      <SearchPanel />
      <ColumnsContainer>
        {kanbans.map((kanban) => (
          <KanbanColumn kanban={kanban} key={kanban.id} />
        ))}
      </ColumnsContainer>
    </div>
  );
};

const ColumnsContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-right: 2rem;
`;

export default KanBan;
