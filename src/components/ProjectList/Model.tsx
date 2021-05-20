import styled from "@emotion/styled";
import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib/FullPageLoading";
import UserSelect from "components/UserSelect";
import { useAddProject, useEditProject, useProjectModel } from "hooks";
import React, { FC, useEffect } from "react";

const Model: FC = () => {
  const {
    projectModelOpen,
    close,
    editingProject,
    isLoading,
  } = useProjectModel();
  const useMutateProject = editingProject ? useEditProject : useAddProject;

  const title = editingProject ? "编辑项目" : "创建项目";

  const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject();
  const [form] = useForm();
  const onFinish = (values: any) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields();
      close();
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingProject);
  }, [editingProject, form]);

  return (
    <Drawer
      width="100%"
      forceRender={true}
      onClose={close}
      visible={projectModelOpen}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>{title}</h1>
            <ErrorBox error={error} />
            <Form
              layout="vertical"
              style={{ width: "40rem" }}
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: false, message: "请输入项目名" }]}
              >
                <Input placeholder="项目名称" />
              </Form.Item>

              <Form.Item
                label="部门"
                name="organization"
                rules={[{ required: true, message: "请输入所属部门" }]}
              >
                <Input placeholder="所在部门" />
              </Form.Item>

              <Form.Item label="负责人" name="personId">
                <UserSelect defaultOptionName="负责人" />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={mutateLoading}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Model;
