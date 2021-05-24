import { Input } from "antd";
import { useAddKanban } from "hooks/kanban";
import React, { useState } from "react";
import { Container } from "./KanbanColumn";
import { useKanbansQueryKey, useProjectIdInUrl } from "./until";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbansQueryKey());

  const submit = async () => {
    await addKanban({ name, projectId });
    setName("");
  };

  return (
    <Container>
      <Input
        size={"large"}
        placeholder="新建看板名称"
        onPressEnter={submit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Container>
  );
};
