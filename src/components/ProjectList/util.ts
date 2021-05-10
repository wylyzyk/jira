import { useUrlQueryParam } from "hooks";
import { useMemo } from "react";

export function useProjectsSearchParam() {
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
}
