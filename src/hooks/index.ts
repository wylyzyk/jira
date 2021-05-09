import { useHttp } from "network/http";
import { useEffect, useRef, useState } from "react";
import { Project, Users } from "typing";
import { cleanObject } from "utils";

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
  function run(promise: Promise<U>) {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }

    setState({ ...state, stat: "loading" });

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
  }

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    ...state,
  };
};

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  useEffect(() => {
    run(client("projects", { data: cleanObject(param || {}) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  return result;
};

export const useUsers = (param?: Partial<Users>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Users[]>();

  useEffect(() => {
    run(client("users", { data: cleanObject(param || {}) }));
  }, [param]);

  return result;
};
