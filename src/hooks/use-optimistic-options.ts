//乐观更新

import { QueryKey, useQueryClient } from "react-query";
import { Task } from "typing";
import { reorder } from "utils/reorder";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old);
      });
      return { previousItems };
    },
    onError: (error: any, newItem: any, context: any) => {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

export const useReorderKanbanConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) =>
    reorder({ list: old, ...target })
  );
};

export const useReorderTaskConfig = (queryKey: QueryKey) => {
  return useConfig(queryKey, (target, old) => {
    // 客观更新task序列中的位置
    const orderedList = reorder({ list: old, ...target }) as Task[];

    // 由于task排序还可能涉及到所属kanban的改变, 所以还要改变kanbanId
    return orderedList.map((item) => {
      return item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item;
    });
  });
};
