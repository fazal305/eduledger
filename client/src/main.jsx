import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { init } from "./lib/bugwatcher.js";

const { hostname } = window.location;
const environment = /^(localhost|127\.0\.0\.1)$/.test(hostname)
  ? "development"
  : /-git-|-(?=[a-z]*\d)[a-z0-9]{9}-[a-z0-9]+\.vercel\.app$|^deploy-preview-\d+--.+\.netlify\.app$/.test(hostname)
    ? "staging"
    : "production";

if (environment !== "development") {
  let reports = 0;
  const cap = (event) => {
    if (++reports > 20) event.stopImmediatePropagation();
  };
  window.addEventListener("error", cap);
  window.addEventListener("unhandledrejection", cap);
  init({
    key: "bwp_pk_JUSA0tFRnF0c2eqclp0R8kWkm2QfGxHMlHDLGl2z",
    endpoint: "https://bugwatcher-pings-api.onrender.com/api/v1/ping",
    environment,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
