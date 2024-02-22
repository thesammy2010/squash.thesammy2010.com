import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";

process.env.NODE_ENV === "development"
  ? (axios.defaults.baseURL = "http://localhost:5000")
  : (axios.defaults.baseURL = "https://api.thesammy2010.com");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <GoogleOAuthProvider clientId="904361218828-9iva1dgj3dce9eku248e3l71spa5ho3d.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
