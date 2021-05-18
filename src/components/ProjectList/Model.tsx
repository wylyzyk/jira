import { Drawer } from "antd";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  projectListActions,
  selectProjectModelOpen,
} from "./project-list.slice";

const Model: FC = () => {
  const dispatch = useDispatch();
  // useSelector hook
  const projectModelOpen = useSelector(selectProjectModelOpen);

  return (
    <Drawer
      width="100%"
      visible={projectModelOpen}
      onClose={() => dispatch(projectListActions.closeProjectModel())}
    >
      <h1>Project Model</h1>
    </Drawer>
  );
};

export default Model;
