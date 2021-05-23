import { useHttp } from "network/http";
import { useQuery } from "react-query";
import { Kanban } from "typing";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};
