import React from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import KanBan from "./KanBan";
import Epic from "./Epic";

const ProjectItem = () => {
  return (
    <div>
      {/* /kanban hui跳转根路由, 要在原有路径后面添加, 要去掉 / */}
      <Link to="kanban">看板</Link>
      <Link to="epic">任务组</Link>
      <Routes>
        <Route path="/kanban" element={<KanBan />} />
        <Route path="/epic" element={<Epic />} />
        <Navigate to={window.location.pathname + "/kanban"} />
      </Routes>
    </div>
  );
};

export default ProjectItem;
