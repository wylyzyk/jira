import { Table, TableProps } from "antd";
import Pin from "components/Pin";
import dayjs from "dayjs";
import { useEditProject } from "hooks";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Project, Users } from "../../typing";

interface IProps extends TableProps<Project> {
  users: Users[];
  refresh?: () => void;
}

const List: FC<IProps> = ({ users, refresh, ...props }) => {
  const { mutate } = useEditProject();
  // 函数柯里化 point free
  const pinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(refresh);

  return (
    <Table
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            console.log(project);
            return (
              <Pin
                checked={project.pin}
                // TODO: 收藏功能未完成, 后台返回数据有缺失 project.pin
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
      ]}
      {...props}
    />
  );
};

export default List;
