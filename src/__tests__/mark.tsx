import React from "react";
import { render, screen } from "@testing-library/react";
import Mark from "../components/ProjectItem/kanban/mark";

test("Mark 组件正常高亮关键词", () => {
  const name = "物料管理";
  const keywords = "管理";

  render(<Mark name={name} keyword={keywords} />);

  expect(screen.getByText(keywords)).toBeInTheDocument();
  expect(screen.getByText(keywords)).toHaveStyle("color: #257afd");
  expect(screen.getByText("物料")).not.toHaveStyle("color: #257afd");
});
