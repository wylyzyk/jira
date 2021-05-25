import { Button, List, Modal } from "antd";
import { ScreenContainer } from "components/lib/lib";
import { Row } from "components/style/lib";
import dayjs from "dayjs";
import { useDeleteEpic, useEpic } from "hooks/epic";
import { useTasks } from "hooks/task";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Epic } from "typing";
import { useProjectInUrl } from "../kanban/until";
import { CreateEpic } from "./CreateEpic";
import { useEpicQueryKey, useEpicSearchParams } from "./util";

const Epics = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpic(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicQueryKey());
  const [epicCreteOpen, setEpicCreateOpen] = useState(false);

  const confirmDeleteEpic = (epic: Epic) => {
    Modal.confirm({
      title: `确定删除项目组: ${epic.name}`,
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteEpic({ id: epic.id });
      },
    });
  };

  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name} 任务组</h1>
        <Button type="link" onClick={() => setEpicCreateOpen(true)}>
          创建任务组
        </Button>
      </Row>
      <List
        style={{ overflow: "scroll" }}
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button type="link" onClick={() => confirmDeleteEpic(epic)}>
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间： {dayjs(epic.start).format("DD/MM/YYYY")}</div>
                  <div>开始时间： {dayjs(epic.end).format("DD/MM/YYYY")}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task) => (
                  <Link
                    key={task.id}
                    to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                  >
                    {task.name}
                  </Link>
                ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        onClose={() => setEpicCreateOpen(false)}
        visible={epicCreteOpen}
      />
    </ScreenContainer>
  );
};

export default Epics;
