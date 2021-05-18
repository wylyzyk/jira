import React from "react";
import styled from "@emotion/styled";
import { Spin, Typography } from "antd";
import { DevTools } from "jira-dev-tool";

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
      <Typography.Text type="danger">{error?.message}</Typography.Text>
    </FullPage>
  );
};

const FullPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { FullPageLoading, FullPageErrorFallback };
