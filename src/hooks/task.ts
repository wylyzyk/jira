import { useHttp } from "network/http";
import { useQuery } from "react-query";
import { Task } from "typing";

export const useTask = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};
