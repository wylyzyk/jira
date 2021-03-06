import React, { useState } from "react";
import { Button, Card, Divider } from "antd";
import Login from "./Login";
import Register from "./Register";
import styled from "@emotion/styled";
import { ErrorBox } from "components/lib/FullPageLoading";
// import { Helmet } from "react-helmet";

const Unauthenticated = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  return (
    <Container>
      <ShadowCard>
        <Title>{isRegister ? "Sign up" : "Sign in"}</Title>
        {""}
        <ErrorBox error={error} />
        {""}
        {isRegister ? (
          <Register onError={setError} />
        ) : (
          <Login onError={setError} />
        )}
        {""}
        <Divider />
        {""}
        <Button type="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "登录" : "注册"}
        </Button>
      </ShadowCard>
    </Container>
  );
};

export const LongButton = styled(Button)`
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`;

const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 50rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin-top: 50px;
`;

export default Unauthenticated;
