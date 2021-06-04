import React from "react";
// import Authenticated from "components/authenticated";
// import Unauthenticated from "components/unauthenticated";
import { useAuth } from "context/auth-context";
import "./App.css";
import ErrorBoundary from "components/lib/ErrorBoundary";
import {
  FullPageErrorFallback,
  FullPageLoading,
} from "components/lib/FullPageLoading";

// 懒加载
const Authenticated = React.lazy(() => import("./components/authenticated"));
const Unauthenticated = React.lazy(
  () => import("./components/unauthenticated")
);

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <Authenticated /> : <Unauthenticated />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
