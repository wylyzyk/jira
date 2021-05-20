import { useHttp } from "network/http";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { Project, Users } from "typing";
import { cleanObject } from "utils";

export const useProjectModel = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true });
  const close = () => {
    setProjectCreate({ projectCreate: undefined });
    setEditingProjectId({ editingProjectId: undefined });
  };

  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id });

  return {
    projectModelOpen: projectCreate === "true" || Boolean(editingProjectId),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );

  //#region
  /*   
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "PATCH",
      })
    );
  };
  return {
    mutate,
    ...asyncResult,
  }; 
  */
  //#endregion
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: "POST",
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );

  //#region
  /*
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, {
        data: params,
        method: "POST",
      })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
  */
  //#endregion
};

export const useProject = (id?: number) => {
  const client = useHttp();

  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    // id 如果为undefined 不再重新请求
    { enabled: !!id }
  );
};

export const useUrlQueryParam = <T extends string>(keys: T[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(() => {
      return keys.reduce((prev, key) => {
        return { ...prev, [key]: searchParams.get(key) || "" };
      }, {} as { [key in T]: string });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]),
    (params: Partial<{ [key in T]: unknown }>) => {
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const;
};

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  let oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

// 初始化Hook
export function useMount(callback: () => void) {
  useEffect(() => {
    callback();
    // note: 在依赖项中加入, callback 会造成无限循环, 和useCallback和useMemo有关系
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// 防抖
export function useDebounce<T>(value: T, delay?: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    // 在上一次useEffect处理完后会执行
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
}

interface IState<T> {
  error: Error | null;
  data: T | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitialState: IState<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <U>(
  initialState?: IState<U>,
  initialConfig?: typeof defaultConfig
) => {
  const [state, setState] = useState<IState<U>>({
    ...defaultInitialState,
    ...initialState,
  });

  const config = { ...defaultConfig, ...initialConfig };
  const [retry, setRetry] = useState(() => () => {});
  const mountedRef = useMountedRef();

  function setData(data: U) {
    return setState({
      data,
      stat: "success",
      error: null,
    });
  }

  function setError(error: Error) {
    return setState({
      error,
      stat: "error",
      data: null,
    });
  }

  // 用来触发异步请求
  function run(promise: Promise<U>, runConfig?: { retry: () => Promise<U> }) {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }
    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig);
      }
    });
    setState({ ...state, stat: "loading" });

    return (
      promise
        .then((data) => {
          if (mountedRef.current) {
            setData(data);
          }
          return data;
        })
        // catch 将捕获到的异常会消化, 其他函数调用不会再 catch 到异常, 所以不能值返回 err , 要返回 Promise.reject()
        .catch((err) => {
          setError(err);
          if (config.throwOnError) return Promise.reject(err);
          return err;
        })
    );
  }

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    // retry 被调用时, 再次调用 run 刷新页面
    retry,
    setData,
    setError,
    ...state,
  };
};

/**
 * 返回组件的挂载状态, 如果还没有 挂载或已经卸载 ,返回false, 反之, 返回true
 * @returns
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  // useQuery 第一个参数 数组中的值发生变化时, 请求会重新触发
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
  //#region
  /*
  const { run, ...result } = useAsync<Project[]>();

  const fetchProject = () =>
    client("projects", { data: cleanObject(param || {}) });

  useEffect(() => {
    run(fetchProject(), {
      retry: fetchProject,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
  */
  //#endregion
};

export const useUsers = (param?: Partial<Users>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Users[]>();

  useEffect(() => {
    run(client("users", { data: cleanObject(param || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};
