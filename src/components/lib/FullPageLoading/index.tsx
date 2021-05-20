import { DevTools } from "jira-dev-tool";
import React from "react";
import styled from "@emotion/styled";
import { Spin, Typography } from "antd";

const FullPageLoading = () => {
  return (
    <FullPage>
      <Spin size="large" />
    </FullPage>
  );
};

const FullPageErrorFallback = ({ error }: { error: Error | null }) => {
  return (
    <FullPage>
      <DevTools />
      <ErrorBox error={error} />
      <Typography.Text type="danger">{error?.message}</Typography.Text>
    </FullPage>
  );
};

// 类型守卫
// 如果 value.message 存在, 返回true , value 的类型就是Error
const isError = (value: any): value is Error => value?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text>{error?.message}</Typography.Text>;
  }

  return null;
};

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { FullPageLoading, FullPageErrorFallback };
