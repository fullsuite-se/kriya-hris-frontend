import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HeaderProvider } from "./context/HeaderContext";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeaderProvider>
      <App />
      <Toaster  richColors position="top-center"/>
    </HeaderProvider>
  </StrictMode>
);
