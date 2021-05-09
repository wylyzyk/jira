import React from "react";
import Authenticated from "components/authenticated";
import Unauthenticated from "components/unauthenticated";
import { useAuth } from "context/auth-context";
import "./App.css";
import ErrorBoundary from "components/ErrorBoundary";
import { FullPageErrorFallback } from "components/FullPageLoading";

function App() {
  const { user } = useAuth();
  return (
    <ErrorBoundary fallbackRender={FullPageErrorFallback}>
      <div className="App">
        {user ? <Authenticated /> : <Unauthenticated />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
