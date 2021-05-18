import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "store";
import { AuthProvider } from "./auth-context";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>{children}</AuthProvider>;
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProvider;
