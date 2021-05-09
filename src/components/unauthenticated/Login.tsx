import React from "react";
import { Form, Input } from "antd";
import { useAuth } from "context/auth-context";
import { LongButton } from ".";
import { useAsync } from "hooks";

const Login = ({ onError }: { onError: (error: Error) => void }) => {
  const { login } = useAuth();
  const { isLoading, run } = useAsync(undefined, { throwOnError: true });

  async function onSubmit(values: { username: string; password: string }) {
    try {
      await run(login(values));
    } catch (e) {
      onError(e);
    }
  }

  return (
    <Form onFinish={onSubmit}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "please input username" }]}
      >
        <Input type="text" placeholder="username" id="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "please input password" }]}
      >
        <Input type="password" placeholder="password" id="password" />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType="submit" type="primary">
          登录
        </LongButton>
      </Form.Item>
    </Form>
  );
};

export default Login;
