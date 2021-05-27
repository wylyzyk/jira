import { useUrlQueryParam } from "hooks";
import { useMemo } from "react";

// 项目列表搜索的参数
export const useProjectsSearchParam = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({
        ...param,
        personId: Number(param.personId) || undefined,
      }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectQueryKey = () => {
  const [params] = useProjectsSearchParam();
  return ["projects", params];
};
