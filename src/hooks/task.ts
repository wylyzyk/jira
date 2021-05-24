import { useHttp } from "network/http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { SortProps, Task } from "typing";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderKanbanConfig,
  useReorderTaskConfig,
} from "./use-optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks`, {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        data: params,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

export const useTask = (id: number) => {
  const client = useHttp();

  return useQuery(["task", { id }], () => client(`tasks${id}`), {
    enabled: !!id,
  });
};

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(({ id }: { id: number }) => {
    return client(`tasks/${id}`, {
      method: "DELETE",
    });
  }, useDeleteConfig(queryKey));
};

export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation((params: SortProps) => {
    return client("kanbans/reorder", {
      method: "POST",
      data: params,
    });
  }, useReorderKanbanConfig(queryKey));
};

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation((params: SortProps) => {
    return client("tasks/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderTaskConfig(queryKey));
};
