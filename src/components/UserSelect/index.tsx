import IdSelect from "components/lib/IdSelect";
import { useUsers } from "hooks";
import React from "react";

const UserSelect = (props: React.ComponentProps<typeof IdSelect>) => {
  const { data: users } = useUsers();
  return <IdSelect options={users || []} {...props} />;
};

export default UserSelect;
