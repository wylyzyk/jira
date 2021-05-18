import { useHttp } from "network/http";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { Project, Users } from "typing";
import { cleanObject } from "utils";

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
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
};

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
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

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [mountedRef, dispatch]
  );
};

export const useAsync = <U>(
  initialState?: IState<U>,
  initialConfig?: typeof defaultConfig
) => {
  const [state, dispatch] = useReducer(
    (state: IState<U>, action: Partial<IState<U>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );

  const config = { ...defaultConfig, ...initialConfig };
  const [retry, setRetry] = useState(() => () => {});
  const safeDispatch = useSafeDispatch(dispatch);

  const setData = useCallback(
    (data: U) => {
      return safeDispatch({
        data,
        stat: "success",
        error: null,
      });
    },
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) => {
      return safeDispatch({
        error,
        stat: "error",
        data: null,
      });
    },
    [safeDispatch]
  );

  // 用来触发异步请求
  const run = useCallback(
    (promise: Promise<U>, runConfig?: { retry: () => Promise<U> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入Promise类型数据");
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });
      // 直接使用state() 会导致页面无限渲染, 避免直接使用state, 使用setState的第二种用法, 此时也不用依赖state
      // setState((preState) => ({ ...preState, stat: "loading" }));
      safeDispatch({ stat: "loading" });

      return (
        promise
          .then((data) => {
            setData(data);
            return data;
          })
          // catch 将捕获到的异常会消化, 其他函数调用不会再 catch 到异常, 所以不能值返回 err , 要返回 Promise.reject()
          .catch((err) => {
            setError(err);
            if (config.throwOnError) return Promise.reject(err);
            return err;
          })
      );
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );

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
  const { run, ...result } = useAsync<Project[]>();

  const fetchProject = useCallback(
    () => client("projects", { data: cleanObject(param || {}) }),
    [param, client]
  );

  useEffect(() => {
    run(fetchProject(), {
      retry: fetchProject,
    });
  }, [param, run, fetchProject]);

  return result;
};

export const useUsers = (param?: Partial<Users>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Users[]>();

  useEffect(() => {
    run(client("users", { data: cleanObject(param || {}) }));
  }, [param, run, client]);

  return result;
};
