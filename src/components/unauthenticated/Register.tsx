import React from "react";
import { useAuth } from "context/auth-context";
import { Form, Input } from "antd";
import { LongButton } from ".";
import { useAsync } from "hooks";

const Register = ({ onError }: { onError: (error: Error) => void }) => {
  const { register } = useAuth();
  const { isLoading, run } = useAsync(undefined, { throwOnError: true });

  async function onSubmit({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) {
    if (cpassword !== values.password) {
      onError(new Error("两次密码输入不一致"));
      return;
    }

    try {
      await run(register(values));
    } catch (e) {
      console.log(e);
      onError(e);
    }
  }

  return (
    <Form onFinish={onSubmit}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input type="text" placeholder="username" id="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input type="password" placeholder="password" id="password" />
      </Form.Item>
      <Form.Item
        name="cpassword"
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input
          type="password"
          placeholder="input password agin"
          id="cpassword"
        />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType="submit" type="primary">
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};

export default Register;
