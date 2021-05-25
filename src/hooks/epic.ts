import { useHttp } from "network/http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "typing";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

export const useEpic = (param?: Partial<Epic>) => {
  const client = useHttp();

  return useQuery<Epic[]>(["epics", param], () => {
    return client("epics", { data: param });
  });
};

export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation((params: Partial<Epic>) => {
    return client(`epics`, {
      data: params,
      method: "POST",
    });
  }, useAddConfig(queryKey));
};

export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(({ id }: { id: number }) => {
    return client(`epics/${id}`, {
      method: "DELETE",
    });
  }, useDeleteConfig(queryKey));
};
