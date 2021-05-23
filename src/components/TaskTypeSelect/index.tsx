import IdSelect from "components/lib/IdSelect";
import { useTaskTypes } from "hooks/task-type";
import React from "react";

export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data: taskTypes } = useTaskTypes();

  return <IdSelect options={taskTypes || []} {...props} />;
};
