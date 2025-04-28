import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import ScrollToHashElement from "./ScrollToHashElement";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToHashElement/>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);