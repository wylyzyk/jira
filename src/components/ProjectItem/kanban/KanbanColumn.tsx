import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { Row } from "components/style/lib";
import { useDeleteKanban } from "hooks/kanban";
import { useTasks } from "hooks/task";
import { useTaskTypes } from "hooks/task-type";
import React, { forwardRef } from "react";
import { Kanban, Task } from "typing";
import { CreateTask } from "./CreateTask";
import Mark from "./mark";
import { useKanbansQueryKey, useTaskModal, useTaskSearchParams } from "./until";
import taskIcon from "assets/task.svg";
import bugIcon from "assets/bug.svg";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;

  if (!name) {
    return null;
  }

  return <img alt="task-icon" src={name === "task" ? taskIcon : bugIcon} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTaskSearchParams();

  return (
    <Card
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
      onClick={() => startEdit(task.id)}
    >
      <p>
        <Mark keyword={keyword} name={task.name} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

const KanbanColumn = forwardRef<HTMLDivElement, { kanban: Kanban }>(
  ({ kanban, ...props }, ref) => {
    const { data: allTasks } = useTasks(useTaskSearchParams());
    const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

    return (
      <Container {...props} ref={ref}>
        <Row between={true}>
          <h3>{kanban.name}</h3>
          <More kanban={kanban} key={kanban.id} />
        </Row>
        <TaskContainer>
          <Drop type="ROW" direction="vertical" droppableId={String(kanban.id)}>
            <DropChild style={{ minHeight: "1rem" }}>
              {tasks?.map((task, taskIndex) => (
                <Drag
                  key={task.id}
                  index={taskIndex}
                  draggableId={"task" + task.id}
                >
                  {/* 可以React.forwardRef 进行Ref转发, 也可以使用原生div标签进行包裹, 因为div 是可以接受Ref的 */}
                  <div>
                    <TaskCard key={task.id} task={task} />
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <CreateTask kanbanId={kanban.id} />
        </TaskContainer>
      </Container>
    );
  }
);

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };

  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={startDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default KanbanColumn;
