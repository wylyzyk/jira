import { useHttp } from "network/http";
import { useQuery } from "react-query";
import { TaskType } from "typing";

export const useTaskTypes = () => {
  const client = useHttp();

  return useQuery<TaskType[]>(["taskTypes"], () => client("taskTypes"));
};
