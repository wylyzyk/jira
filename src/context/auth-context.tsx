import React, { ReactNode, useCallback } from "react";
import * as auth from "../auth-provider";
import { AuthForm, Users } from "../typing";
import { http } from "network/http";
import { useAsync, useMount } from "hooks";
import {
  FullPageLoading,
  FullPageErrorFallback,
} from "components/lib/FullPageLoading";
import { useDispatch, useSelector } from "react-redux";
import * as authStore from "../store/auth-slice";

// interface IProps {
//   user: Users | null;
//   login: (form: AuthForm) => Promise<void>;
//   register: (form: AuthForm) => Promise<void>;
//   logout: () => Promise<void>;
// }

// 页面刷新初始化user
export const bootsUser = async () => {
  let user = null;
  const token = auth.getToken();

  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

// const AuthContext = createContext<IProps | undefined>(undefined);
// AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    error,
    isLoading,
    isIdle,
    isError,
    run,
    // setData: setUser,
  } = useAsync<Users | null>();

  // const login = (form: AuthForm) => auth.login(form).then(setUser);
  // const register = (form: AuthForm) => auth.register(form).then(setUser);
  // const logout = () => auth.logout().then(() => setUser(null));

  const dispatch: (...args: unknown[]) => Promise<Users> = useDispatch();

  useMount(() => run(dispatch(authStore.bootstrap())));

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  console.log(children);
  return <div>{children}</div>;

  // return (
  //   <AuthContext.Provider
  //     children={children}
  //     value={{ user, login, register, logout }}
  //   />
  // );
};

export const useAuth = () => {
  const dispatch: (...args: unknown[]) => Promise<Users> = useDispatch();

  const user = useSelector(authStore.selectUser);
  const login = useCallback(
    (form: AuthForm) => dispatch(authStore.login(form)),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(authStore.logout()), [dispatch]);
  const register = useCallback(
    (form: AuthForm) => dispatch(authStore.register(form)),
    [dispatch]
  );

  // 使用custom hook 返回自定义函数时, 要用usecallback 包裹
  return {
    user,
    login,
    logout,
    register,
  };
};
