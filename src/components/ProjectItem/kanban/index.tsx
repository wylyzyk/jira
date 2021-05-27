import styled from "@emotion/styled";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { ScreenContainer } from "components/lib/lib";
import { Profiler } from "components/Profiler";
import { useDocumentTitle } from "hooks";
import { useKanbans } from "hooks/kanban";
import { useReorderKanban, useReorderTask, useTasks } from "hooks/task";
import React, { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { CreateKanban } from "./CreateKanban";
import KanbanColumn from "./KanbanColumn";
import SearchPanel from "./search-panel";
import { TaskModal } from "./TaskModal";
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTaskSearchParams,
  useTasksQueryKey,
} from "./until";

const KanBan = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTaskSearchParams());
  const isLoading = kanbanIsLoading || taskIsLoading;
  const onDragEnd = useDragEnd();

  return (
    <Profiler id="看板页面">
      <DragDropContext onDragEnd={onDragEnd}>
        <ScreenContainer>
          <h1>{currentProject?.name} 看板</h1>
          <SearchPanel />
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <ColumnsContainer>
              <Drop type="COLUMN" direction="horizontal" droppableId="kanban">
                <DropChild style={{ display: "flex" }}>
                  {kanbans?.map((kanban, index) => (
                    <Drag
                      key={kanban.id}
                      draggableId={"kanban" + kanban.id}
                      index={index}
                    >
                      <KanbanColumn kanban={kanban} key={kanban.id} />
                    </Drag>
                  ))}
                </DropChild>
              </Drop>
              <CreateKanban />
            </ColumnsContainer>
          )}
          <TaskModal />
        </ScreenContainer>
      </DragDropContext>
    </Profiler>
  );
};

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTask = [] } = useTasks(useTaskSearchParams());

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return;
      }

      // 看板排序
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;

        if (!fromId || !toId || fromId === toId) {
          return;
        }

        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ fromId, referenceId: toId, type });
      }

      // task 排序
      if (type === "ROW") {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;

        // if (fromKanbanId === toKanbanId) {
        //   return;
        // }

        const fromTask = allTask.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const toTask = allTask.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];

        if (fromTask?.id === toTask?.id) {
          return;
        }

        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          fromKanbanId,
          toKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [kanbans, reorderKanban, allTask, reorderTask]
  );
};

const ColumnsContainer = styled("div")`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;

export default KanBan;
