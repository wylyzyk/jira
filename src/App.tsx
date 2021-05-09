import React from "react";
import Authenticated from "components/authenticated";
import Unauthenticated from "components/unauthenticated";
import { useAuth } from "context/auth-context";
import "./App.css";

function App() {
  const { user } = useAuth();
  return (
    <div className="App">{user ? <Authenticated /> : <Unauthenticated />}</div>
  );
}

export default App;
