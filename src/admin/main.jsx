import React from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./AdminApp.jsx";
import AdminAuth from "./AdminAuth.jsx";
import { ToastProvider } from "./ToastContext.jsx";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminAuth>
      <ToastProvider>
        <AdminApp />
      </ToastProvider>
    </AdminAuth>
  </React.StrictMode>
);
