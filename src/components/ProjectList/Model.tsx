import { Drawer } from "antd";
import { useProjectModel } from "hooks";
import React, { FC } from "react";

const Model: FC = () => {
  const { projectModelOpen, close } = useProjectModel();

  return (
    <Drawer width="100%" onClose={close} visible={projectModelOpen}>
      <h1>Project Model</h1>
    </Drawer>
  );
};

export default Model;
