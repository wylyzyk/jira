// import { jsx } from "@emotion/react";
import React, { FC } from "react";
import { Form, Input } from "antd";
import { Project, Users } from "../../typing";
import UserSelect from "components/UserSelect";

interface IProps {
  users: Users[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: IProps["param"]) => void;
}
const Search: FC<IProps> = ({ users, param, setParam }) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        <Input
          type="text"
          value={param.name}
          onChange={(e) => setParam({ ...param, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
        />
      </Form.Item>
    </Form>
  );
};

export default Search;
