import IdSelect from "components/lib/IdSelect";
import { useEpic } from "hooks/epic";
import React from "react";

export const EpicSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: epics } = useEpic();

  return <IdSelect options={epics || []} {...props} />;
};
