import { Suspense } from "react";
import "./App.css";
import { Todos } from "./components/todos/Todos";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <div>
      <ErrorBoundary>
        <Suspense fallback="loading">
          <Todos />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
