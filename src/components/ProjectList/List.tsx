import { Dropdown, Menu, Modal, Table, TableProps } from "antd";
import ButtonNoPadding from "components/lib/Button";
import Pin from "components/lib/Pin";
import dayjs from "dayjs";
import { useDeleteProject, useEditProject, useProjectModel } from "hooks";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Project, Users } from "../../typing";
import { useProjectQueryKey } from "./util";

interface IProps extends TableProps<Project> {
  users: Users[];
}

/**
 * memo 会在两种情况下进行冲洗渲染
 * 1. React.memo() 会浅对比 props, 发生改变重新渲染
 * 2. 在 Redux 这种状态管理下, 状态改变也会跟着改变
 *
 * React.memo()和useMemo() 的区别
 * React.memo() 是用来包裹一个组件
 * useMemo() 是用来包裹一个值
 */
const List: FC<IProps> = React.memo(({ users, ...props }) => {
  const { mutate } = useEditProject(useProjectQueryKey());
  // 函数柯里化 point free
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });

  return (
    <Table
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
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
        {
          render(value, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
});

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModel();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectQueryKey());

  const confirmDeleteProject = (id: number) => {
    Modal.confirm({
      title: "确认删除这个项目吗?",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="edit" onClick={editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item
            key="delete"
            onClick={() => confirmDeleteProject(project.id)}
          >
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  );
};

export default List;
