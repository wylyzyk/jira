import { Button, Drawer, DrawerProps, Form, Input, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib/FullPageLoading";
import UserSelect from "components/UserSelect";
import { useAddEpic } from "hooks/epic";
import React, { useEffect } from "react";
import { Container } from "../kanban/KanbanColumn";
import { useProjectIdInUrl } from "../kanban/until";
import { useEpicQueryKey } from "./util";

export const CreateEpic = (
  props: Pick<DrawerProps, "visible"> & { onClose: () => void }
) => {
  const { mutate: addEpic, isLoading, error } = useAddEpic(useEpicQueryKey());
  const [form] = useForm();
  const projectId = useProjectIdInUrl();

  const onFinish = async (value: any) => {
    await addEpic({ ...value, projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.visible]);

  return (
    <Drawer
      width="100%"
      visible={props.visible}
      onClose={props.onClose}
      forceRender={true}
      destroyOnClose={true}
    >
      <Container>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h1>创建任务组</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout="vertical"
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入任务组名" }]}
              >
                <Input placeholder="请输入任务组名称" />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button loading={isLoading} type="primary" htmlType="submit">
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
