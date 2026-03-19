import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { DashboardProvider } from "./context/DashboardContext.tsx";

/**
 * APPLICATION ENTRY POINT
 * Initializes the React root and wraps the app in the global DashboardProvider.
 * DashboardProvider manages shared state across all widgets (Todos, Notes, etc.).
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </StrictMode>,
);
