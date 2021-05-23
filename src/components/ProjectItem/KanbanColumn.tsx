import styled from "@emotion/styled";
import { Card } from "antd";
import { useTask } from "hooks/task";
import { useTaskTypes } from "hooks/task-type";
import React from "react";
import { Kanban } from "typing";
import { useTaskSearchParams } from "./until";

// const TaskTypeIcon = ({ id }: { id: number }) => {
//   const { data: taskTypes } = useTaskTypes();
//   const name = taskTypes?.find((taskType) => taskType.id === id)?.name;

//   if (!name) {
//     return null;
//   }

//   // TODO: taskIcon 和 bugIcon 未引入
//   return <img src={name === "task" ? taskIcon : bugIcon} />
// };

const KanbanColumn = ({ kanban }: { kanban: Kanban }) => {
  const { data: allTasks } = useTask(useTaskSearchParams());
  const tasks = allTasks?.filter((task) => task.projectId === kanban.id);

  return (
    <Container>
      <h3>{kanban.name}</h3>
      <TaskContainer>
        {tasks?.map((task) => (
          <Card style={{ marginBottom: "0.5rem" }} key={task.id}>
            <div>{task.name}</div>
            {/* <TaskTypeIcon id={task.id} /> */}
          </Card>
        ))}
      </TaskContainer>
    </Container>
  );
};

const Container = styled.div`
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
