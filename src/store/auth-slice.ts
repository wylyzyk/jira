import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import { AuthForm, Users } from "../typing";
import * as auth from "auth-provider";
import { bootsUser } from "context/auth-context";

interface IState {
  user: Users | null;
}

const initialState: IState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

const { setUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export const login = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.login(form).then((user) => dispatch(setUser(user)));
export const register = (form: AuthForm) => (dispatch: AppDispatch) =>
  auth.register(form).then((user) => dispatch(setUser(user)));
export const logout = () => (dispatch: AppDispatch) =>
  auth.logout().then(() => dispatch(setUser(null)));
export const bootstrap = () => (dispatch: AppDispatch) =>
  bootsUser().then((user) => dispatch(setUser(user)));
